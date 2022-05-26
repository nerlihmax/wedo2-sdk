import * as R from 'ramda';
import { getLogger } from 'loglevel';
const log = getLogger('wedo2-sdk');
import { isLeft } from 'fp-ts/lib/Either';
import { isNone } from 'fp-ts/lib/Option';
import {
  getNoDevice,
  isMotor,
  profile,
  wedo2EventAttachedIoType,
  wedo2Led,
  wedo2PhysicalPort,
} from '@wedo2-sdk/shared';
import { parseSensorValue } from '@/events/sensorValue';
import { registerDevice } from '@/cmds/register';
import {
  getDevice,
  isPortPhysical,
  parseAttachedIo,
} from '@/events/attachedIo';

import type {
  Wedo2BleBackend,
  Wedo2ConnectionConnected,
  Wedo2EventSensorValue,
  Wedo2EventAttachedIoDetach,
  Wedo2PhysicalDevice,
} from '@wedo2-sdk/shared';

export const connect = async <T extends Wedo2BleBackend>(
  backend: T
): Promise<Wedo2ConnectionConnected<T>> => {
  await backend.connect();

  const connection: Wedo2ConnectionConnected<T> = {
    state: 'connected',
    deviceName: backend.deviceName,
    backend,
    ports: {
      [wedo2PhysicalPort.PORT1]: getNoDevice(wedo2PhysicalPort.PORT1),
      [wedo2PhysicalPort.PORT2]: getNoDevice(wedo2PhysicalPort.PORT2),
    },
  };

  await connection.backend.subscribe(
    profile.services.commonService.characteristics.attachedIo
  );

  await connection.backend.subscribe(
    profile.services.ioService.characteristics.sensorValue
  );

  await registerDevice(connection, wedo2Led);

  return connection;
};

export const setAttachIoListener = ({
  attach,
  detach,
}: {
  attach: (device: Wedo2PhysicalDevice) => void;
  detach: (device: Wedo2EventAttachedIoDetach) => void;
}) =>
  R.tap((connection: Wedo2ConnectionConnected<Wedo2BleBackend>) =>
    connection.backend.addNotificationCallback(
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

export const setSensorValueListener = (
  listener: (value: Wedo2EventSensorValue) => void
) =>
  R.tap((connection: Wedo2ConnectionConnected<Wedo2BleBackend>) =>
    connection.backend.addNotificationCallback(
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
