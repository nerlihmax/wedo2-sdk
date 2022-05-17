import * as R from 'ramda';
import { isLeft } from 'fp-ts/Either';
import { isNone } from 'fp-ts/lib/Option';
import noble from '@abandonware/noble';
import log from 'loglevel';

import {
  Connect,
  AddPortAttachmentsListener,
  Wedo2ConnectionConnected,
} from './types';
import { profile, UUID } from '../gatt';
import { addNotificationCallback, subscribe } from '../characteristic';
import { registerDevice } from '../wedo2/cmds/input';
import {
  getDeviceFromEvent,
  parseAttachedIo,
  wedo2EventAttachedIoType,
} from '../wedo2/events/attachedIo';

const isWedo2 = (identity: UUID) => (ad: noble.Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(R.equals(identity)) !== -1;

export const connect: Connect = async () => {
  await noble.startScanningAsync();

  return new Promise((resolve) => {
    noble.on('discover', async (peripheral) => {
      const { advertisement } = peripheral;
      const { localName } = advertisement;

      if (isWedo2(profile.services.commonService.uuid)(advertisement)) {
        log.info(`найдено wedo2 устройство ${localName}`);
        await peripheral.connectAsync();
        await peripheral.discoverAllServicesAndCharacteristicsAsync();

        const characteristics = peripheral.services.reduce<
          noble.Characteristic[]
        >((acc, curr) => [...acc, ...curr.characteristics], []);

        const connection: Wedo2ConnectionConnected = {
          state: 'connected',
          peripheral,
          characteristics,
        };

        await subscribe(
          connection,
          profile.services.commonService.characteristics.attachedIo
        );

        await subscribe(
          connection,
          profile.services.ioService.characteristics.sensorValue
        );

        resolve(connection);
      }
    });
  });
};

export const addPortAttachmentsListener: AddPortAttachmentsListener =
  ({ attach, detach }) =>
  async (connection) => {
    addNotificationCallback(
      connection,
      profile.services.commonService.characteristics.attachedIo,
      async (data) => {
        log.debug('ble: [attachedIo]: ', data);

        const event = parseAttachedIo(data);
        if (isLeft(event)) {
          log.error(event.left.message);
          return;
        }

        if (event.right.type === wedo2EventAttachedIoType.DETACHED) {
          log.info(`от порта ${event.right.port} отключено устройство`);
          detach(event.right);
        } else if (
          event.right.type === wedo2EventAttachedIoType.ATTACHED_VIRTUAL
        ) {
          log.debug('ble: [attachedIo]: подключено виртуальное устройство');
        } else if (event.right.type === wedo2EventAttachedIoType.ATTACHED) {
          const device = getDeviceFromEvent(event.right);
          if (isNone(device)) {
            log.error('ble: [attachedIo]: подключено неизвестное устройство');
            return;
          }

          // TODO: форматированный вывод девайсов в логи
          log.info(
            `подключено устройство к порту ${device.value.port}`,
            device.value
          );
          await registerDevice(connection, device.value);
          attach(device.value);
        }
      }
    );

    return connection;
  };

// export const setSensorValueListener: SetSensorValueListener;
