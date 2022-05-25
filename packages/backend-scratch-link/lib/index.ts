import * as R from 'ramda';
import WebSocket from 'ws';
import log from 'loglevel';
import { wedo2PhysicalPort, getNoDevice, profile } from '@wedo2-sdk/shared';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/base64';

import type {
  Wedo2BleBackend,
  Wedo2ConnectionConnected,
} from '@wedo2-sdk/shared';
import type {
  SLRequestConnect,
  SLRequestDiscover,
  SLRequestStartNotifications,
  SLRequestWrite,
  SLResponse,
  SLResponseEmpty,
} from '@/rpc';

const insert = (ins: string, idx: number) => (orig: string) =>
  orig.slice(0, idx) + ins + orig.slice(idx);

const formatUuid = R.pipe(
  insert('-', 8),
  insert('-', 13),
  insert('-', 18),
  insert('-', 23)
);

const useCounter = () => {
  let count = 0;
  return () => (count += 1);
};

log.setDefaultLevel('debug');

const url = 'ws://localhost:20111/scratch/ble';

const ws = new WebSocket(url);
const getRequestId = useCounter();

export type Wedo2ScratchLink = Wedo2BleBackend<WebSocket | null>;
export const wedo2ScratchLink: Wedo2ScratchLink = {
  _conn: null,
  async connect() {
    return new Promise((resolve) => {
      ws.on('open', async () => {
        this._conn = ws;

        const discover: SLRequestDiscover = {
          id: getRequestId(),
          jsonrpc: '2.0',
          method: 'discover',
          params: {
            filters: [
              { services: [formatUuid(profile.services.commonService.uuid)] },
            ],
            optionalServices: [formatUuid(profile.services.ioService.uuid)],
          },
        };
        log.debug('[rpc] send: ', discover);
        ws.send(JSON.stringify(discover));

        const { deviceName, connectId } = await new Promise((resolve) => {
          const listener = (data: WebSocket.RawData) => {
            const response = JSON.parse(data.toString()) as SLResponse;
            log.debug('[rpc] receive: ', response);
            if (response?.method === 'didDiscoverPeripheral') {
              const connectId = getRequestId();
              const connect: SLRequestConnect = {
                id: connectId,
                jsonrpc: '2.0',
                method: 'connect',
                params: {
                  peripheralId: response.params.peripheralId,
                },
              };
              log.debug('[rpc] send: ', connect);
              ws.send(JSON.stringify(connect));
              resolve({ connectId, deviceName: response.params.name });
              ws.off('message', listener);
            }
          };
          ws.on('message', listener);
        });

        await new Promise<void>((resolve) => {
          const listener = (data: WebSocket.RawData) => {
            const response = JSON.parse(data.toString()) as SLResponseEmpty;
            log.debug('[rpc] receive: ', response);
            if (response.id === connectId) {
              resolve();
              ws.off('message', listener);
            }
          };
          ws.on('message', listener);
        });

        const connection: Wedo2ConnectionConnected<Wedo2ScratchLink> = {
          state: 'connected',
          deviceName,
          backend: this,
          ports: {
            [wedo2PhysicalPort.PORT1]: getNoDevice(wedo2PhysicalPort.PORT1),
            [wedo2PhysicalPort.PORT2]: getNoDevice(wedo2PhysicalPort.PORT2),
          },
        };

        resolve(connection);
      });
    });
  },
  async write(char, payload) {
    if (this._conn === null) {
      log.error('[scratch-link]: conn is null');
    } else {
      log.debug(`[scratch-link]: пишу в характеристику ${char.slice(4, 8)}`);

      const service = Object.values(profile.services).find((service) =>
        Object.values(service.characteristics).find(R.equals(char))
      );

      if (!service) {
        throw new Error(`куда-то пропал gatt-сервис c характеристикой ${char}`);
      }

      const write: SLRequestWrite = {
        id: getRequestId(),
        jsonrpc: '2.0',
        method: 'write',
        params: {
          serviceId: formatUuid(service.uuid),
          characteristicId: formatUuid(char),
          encoding: 'base64',
          message: uint8ArrayToBase64(payload),
        },
      };
      log.debug('[rpc] send: ', write);
      ws.send(JSON.stringify(write));
    }
  },
  async subscribe(char) {
    if (this._conn === null) {
      log.error('[scratch-link]: conn is null');
    } else {
      log.debug(
        `[scratch-link]: подписался нотификации на ${char.slice(4, 8)}`
      );

      const service = Object.values(profile.services).find((service) =>
        Object.values(service.characteristics).find(R.equals(char))
      );

      if (!service) {
        throw new Error(`куда-то пропал gatt-сервис c характеристикой ${char}`);
      }

      const subscribe: SLRequestStartNotifications = {
        id: getRequestId(),
        jsonrpc: '2.0',
        method: 'startNotifications',
        params: {
          serviceId: formatUuid(service.uuid),
          characteristicId: formatUuid(char),
          encoding: 'base64',
        },
      };
      log.debug('[rpc] send: ', subscribe);
      ws.send(JSON.stringify(subscribe));
    }
  },
  async addNotificationCallback(char, callback) {
    if (this._conn === null) {
      log.error('[scratch-link]: conn is null');
    } else {
      log.debug(
        `[scratch-link]: ставлю колбек на нотификацию на характеристику ${char.slice(
          4,
          8
        )}`
      );

      ws.on('message', (data) => {
        const response = JSON.parse(data.toString()) as SLResponse;
        log.debug('[rpc] receive: ', data.toString());

        if (response?.method === 'characteristicDidChange') {
          if (response.params?.characteristicId === formatUuid(char)) {
            callback(Buffer.from(base64ToUint8Array(response.params.message)));
          }
        }
      });
    }
  },
};
