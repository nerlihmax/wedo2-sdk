import * as R from 'ramda';
import { isLeft } from 'fp-ts/Either';
import { isNone } from 'fp-ts/Option';
import noble from '@abandonware/noble';
import log from 'loglevel';

import type { Advertisement } from '@abandonware/noble';

import { profile } from '@/gatt';
import { addNotificationCallback, subscribe } from '@/characteristic';
import { registerDevice } from '@/wedo2/cmds/register';
import {
  getDevice,
  isPortPhysical,
  parseAttachedIo,
  wedo2EventAttachedIoType,
} from '@/wedo2/events/attachedIo';
import { wedo2Led } from '@/wedo2/devices/led';
import { wedo2PhysicalPort } from '@/wedo2/devices';
import { parseSensorValue } from '@/wedo2/events/sensorValue';

import type {
  Connect,
  SetAttachIoListener,
  SetSensorValueListener,
  Wedo2ConnectionConnected,
} from './types';
import type { UUID } from '@/gatt';
import type {
  Wedo2NoDevice,
  Wedo2PhysicalDevice,
  Wedo2PhysicalPort,
} from '@/wedo2/devices';
import type { Wedo2Motor } from '@/wedo2/devices/motor';

const isWedo2 = (identity: UUID) => (ad: Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(R.equals(identity)) !== -1;

const getNoDevice = (port: Wedo2PhysicalPort): Wedo2NoDevice => ({
  tag: 'noDevice',
  port,
});

function isMotor(device: Wedo2PhysicalDevice): device is Wedo2Motor {
  return device.tag === 'motor';
}

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
          deviceName: localName,
          peripheral,
          characteristics,
          ports: {
            [wedo2PhysicalPort.PORT1]: getNoDevice(wedo2PhysicalPort.PORT1),
            [wedo2PhysicalPort.PORT2]: getNoDevice(wedo2PhysicalPort.PORT2),
          },
        };

        await subscribe(
          connection,
          profile.services.commonService.characteristics.attachedIo
        );

        await subscribe(
          connection,
          profile.services.ioService.characteristics.sensorValue
        );

        await registerDevice(connection, wedo2Led);

        resolve(connection);
      }
    });
  });
};

export const setAttachIoListener: SetAttachIoListener = ({ attach, detach }) =>
  R.tap((connection) =>
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
          if (!isPortPhysical(event.right.port)) return;

          const device = connection.ports[event.right.port];

          log.info(
            `от порта ${device.port} отключено устройство ${device.tag}`
          );

          connection.ports[event.right.port] = getNoDevice(event.right.port);
          detach(event.right);
        } else if (event.right.type === wedo2EventAttachedIoType.ATTACHED) {
          if (!isPortPhysical(event.right.port)) return;

          const device = getDevice(event.right.ioType, event.right.port);
          if (isNone(device)) {
            log.error('ble: [attachedIo]: подключено неизвестное устройство');
            return;
          }

          // TODO: форматированный вывод девайсов в логи
          log.info(
            `подключено устройство к порту ${device.value.port}`,
            device.value
          );

          connection.ports[device.value.port] = device.value;

          if (!isMotor(device.value))
            await registerDevice(connection, device.value);

          attach(device.value);
        } else if (
          event.right.type === wedo2EventAttachedIoType.ATTACHED_VIRTUAL
        ) {
          log.debug('ble: [attachedIo]: подключено виртуальное устройство');
        }
      }
    )
  );

export const setSensorValueListener: SetSensorValueListener = (listener) =>
  R.tap((connection) =>
    addNotificationCallback(
      connection,
      profile.services.ioService.characteristics.sensorValue,
      async (data) => {
        log.debug('ble: [sensorValue]: ', connection.ports);
        log.debug('ble: [sensorValue]: ', data);

        const value = parseSensorValue(data, connection.ports);
        if (isLeft(value)) {
          log.debug(value.left.message);
          return;
        }

        listener(value.right);
      }
    )
  );
