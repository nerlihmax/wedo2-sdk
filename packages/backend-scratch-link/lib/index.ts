import WebSocket from 'ws';
import { getLogger } from 'loglevel';
const log = getLogger('wedo2-sdk');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require('node:process');
log.setLevel(
  (process.env?.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);
import { profile } from '@wedo2-sdk/shared';
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/base64';
import { useCounter, formatUuid, findService } from '@/utils';

import type { Wedo2BleBackend, UUID } from '@wedo2-sdk/shared';
import type {
  SLRequestConnect,
  SLRequestDiscover,
  SLRequestStartNotifications,
  SLRequestWrite,
  SLResponse,
  SLResponseEmpty,
} from '@/rpc';

export class Wedo2ScratchLink implements Wedo2BleBackend {
  private ws: WebSocket;
  private url: string;
  private getRequestId = useCounter();
  public deviceName = '';

  constructor({ url = 'ws://localhost:20111/scratch/ble' }: { url: string }) {
    this.url = url;
    this.ws = new WebSocket(this.url);
  }

  async connect() {
    log.debug('[scratch-link]: запущен бекенд scratch link');

    return new Promise<void>((resolve) => {
      this.ws.on('open', async () => {
        const discover: SLRequestDiscover = {
          id: this.getRequestId(),
          jsonrpc: '2.0',
          method: 'discover',
          params: {
            filters: [
              { services: [formatUuid(profile.services.commonService.uuid)] },
            ],
            optionalServices: [formatUuid(profile.services.ioService.uuid)],
          },
        };
        log.debug('[scratch-link][rpc] отправил: ', discover);
        this.ws.send(JSON.stringify(discover));

        const { deviceName, requestId } = await new Promise((resolve) => {
          const listener = (data: WebSocket.RawData) => {
            const response = JSON.parse(data.toString()) as SLResponse;
            log.debug('[scratch-link][rpc] получил: ', response);
            if (response?.method === 'didDiscoverPeripheral') {
              const requestId = this.getRequestId();
              const connect: SLRequestConnect = {
                id: requestId,
                jsonrpc: '2.0',
                method: 'connect',
                params: {
                  peripheralId: response.params.peripheralId,
                },
              };
              log.debug('[scratch-link][rpc] отправил: ', connect);
              this.ws.send(JSON.stringify(connect));
              resolve({ requestId, deviceName: response.params.name });
              this.ws.off('message', listener);
            }
          };
          this.ws.on('message', listener);
        });

        this.deviceName = deviceName;

        await new Promise<void>((resolve) => {
          const listener = (data: WebSocket.RawData) => {
            const response = JSON.parse(data.toString()) as SLResponseEmpty;
            log.debug('[scratch-link][rpc] принял: ', response);
            if (response.id === requestId) {
              resolve();
              this.ws.off('message', listener);
            }
          };
          this.ws.on('message', listener);
        });

        resolve();
      });
    });
  }

  async write(char: UUID, payload: Buffer) {
    const service = findService(char);

    const write: SLRequestWrite = {
      id: this.getRequestId(),
      jsonrpc: '2.0',
      method: 'write',
      params: {
        serviceId: formatUuid(service.uuid),
        characteristicId: formatUuid(char),
        encoding: 'base64',
        message: uint8ArrayToBase64(payload),
      },
    };

    log.debug('[scratch-link][rpc] отправил: ', write);
    this.ws.send(JSON.stringify(write));
  }

  async subscribe(char: UUID) {
    log.debug(`[scratch-link]: подписался нотификации на ${char.slice(4, 8)}`);

    const service = findService(char);

    const subscribe: SLRequestStartNotifications = {
      id: this.getRequestId(),
      jsonrpc: '2.0',
      method: 'startNotifications',
      params: {
        serviceId: formatUuid(service.uuid),
        characteristicId: formatUuid(char),
        encoding: 'base64',
      },
    };

    log.debug('[scratch-link][rpc] отправил: ', subscribe);
    this.ws.send(JSON.stringify(subscribe));
  }

  addNotificationCallback(char: UUID, callback: (data: Buffer) => void) {
    log.debug(
      `[scratch-link]: поставил коллбек на нотификацию на характеристику ${char.slice(
        4,
        8
      )}`
    );

    this.ws.on('message', (data) => {
      const response = JSON.parse(data.toString()) as SLResponse;
      log.debug('[scratch-link][rpc] принял: ', data.toString());

      if (response?.method === 'characteristicDidChange') {
        if (response.params?.characteristicId === formatUuid(char)) {
          callback(Buffer.from(base64ToUint8Array(response.params.message)));
        }
      }
    });
  }

  async disconnect() {
    log.debug(`[scratch-link]: сделан запрос на дисконнект`);

    return new Promise<void>((resolve) => {
      this.ws.close();
      this.ws.on('close', () => resolve());
    });
  }

  onDisconnect(callback: () => void) {
    log.debug(`[scratch-link]: поставил коллбек на дисконнект`);

    this.ws.prependListener('close', () => callback());
  }
}
