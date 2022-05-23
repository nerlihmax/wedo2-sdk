import * as R from 'ramda';
import noble, { Characteristic, Peripheral } from '@abandonware/noble';
import log from 'loglevel';
import { profile, wedo2PhysicalPort, getNoDevice } from '@wedo2-sdk/shared';

import type { Advertisement } from '@abandonware/noble';
import type {
  Wedo2BleBackend,
  UUID,
  Wedo2ConnectionConnected,
} from '@wedo2-sdk/shared';

const isWedo2 = (identity: UUID) => (ad: Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(R.equals(identity)) !== -1;

const findByUuid = (uuid: UUID) => R.propEq('uuid', uuid);

const findCharacteristic = (
  peripheral: Peripheral,
  char: UUID
): Characteristic => {
  const service = peripheral.services.find((service) =>
    service.characteristics.find(findByUuid(char))
  );

  const characteristic = service?.characteristics.find(findByUuid(char));

  if (!characteristic) {
    throw new Error(`куда-то пропала gatt-характеристика ${char}`);
  }

  return characteristic;
};

export type Wedo2Noble = Wedo2BleBackend<Peripheral | null>;
export const wedo2Noble: Wedo2Noble = {
  _conn: null,
  connect: async () => {
    await noble.startScanningAsync();

    const peripheral = await new Promise<Peripheral>((resolve) => {
      noble.on('discover', async (peripheral) => {
        const { advertisement } = peripheral;
        const { localName } = advertisement;

        if (isWedo2(profile.services.commonService.uuid)(advertisement)) {
          log.info(`найдено wedo2 устройство ${localName}`);
          await peripheral.connectAsync();
          await peripheral.discoverAllServicesAndCharacteristicsAsync();

          resolve(peripheral);
        }
      });
    });

    const { advertisement } = peripheral;
    const { localName } = advertisement;

    const backend = wedo2Noble;

    const connection: Wedo2ConnectionConnected<typeof wedo2Noble> = {
      state: 'connected',
      deviceName: localName,
      backend,
      ports: {
        [wedo2PhysicalPort.PORT1]: getNoDevice(wedo2PhysicalPort.PORT1),
        [wedo2PhysicalPort.PORT2]: getNoDevice(wedo2PhysicalPort.PORT2),
      },
    };

    connection.backend._conn = peripheral;

    return connection;
  },
  async subscribe(connection, char) {
    if (connection.backend._conn === null) {
      log.error('[noble]: conn is null');
    } else {
      log.debug(`ble: подписался нотификации на ${char.slice(4, 8)}`);

      findCharacteristic(connection.backend._conn, char).notifyAsync(true);
    }
  },
  async write(connection, char, payload) {
    if (connection.backend._conn === null) {
      log.error('[noble]: conn is null');
    } else {
      log.debug(`ble: пишу в характеристику ${char.slice(4, 8)}`, payload);

      findCharacteristic(connection.backend._conn, char).writeAsync(
        payload,
        false
      );
    }
  },
  async addNotificationCallback(connection, char, callback) {
    if (connection.backend._conn === null) {
      log.error('[noble]: conn is null');
    } else {
      log.debug(
        `ble: ставлю колбек на нотификацию на характеристику ${char.slice(
          4,
          8
        )}`
      );

      findCharacteristic(connection.backend._conn, char).on('data', callback);
    }
  },
};