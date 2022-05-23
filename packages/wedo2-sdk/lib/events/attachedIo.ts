import { right, left } from 'fp-ts/Either';
import { some, none } from 'fp-ts/Option';
import { match } from 'ts-pattern';
import {
  wedo2DistanceSensorMode,
  wedo2EventAttachedIoType,
  wedo2IoType,
  wedo2MeasurementUnit,
  wedo2PhysicalPort,
  wedo2TiltSensorMode,
} from '@wedo2-sdk/shared';

import type { Either } from 'fp-ts/Either';
import type { Option } from 'fp-ts/Option';
import type {
  Wedo2Device,
  Wedo2PhysicalDevice,
  Wedo2EventAttachedIo,
  Wedo2IoType,
  Wedo2PhysicalPort,
  Wedo2Port,
} from '@wedo2-sdk/shared';

export function isDevicePhysical(
  device: Wedo2Device
): device is Wedo2PhysicalDevice {
  return (
    device.port === wedo2PhysicalPort.PORT1 ||
    device.port === wedo2PhysicalPort.PORT2
  );
}

export function isPortPhysical(port: Wedo2Port): port is Wedo2PhysicalPort {
  return port === wedo2PhysicalPort.PORT1 || port === wedo2PhysicalPort.PORT2;
}

export const parseAttachedIo = (
  data: Buffer
): Either<Error, Wedo2EventAttachedIo> => {
  const value = [...data];

  const port = value[0];
  const type = value[1];
  const ioType = value[3];

  return match({ port, type, ioType })
    .with({ type: wedo2EventAttachedIoType.DETACHED }, ({ type, port }) =>
      right({ type, port })
    )
    .with(
      { type: wedo2EventAttachedIoType.ATTACHED },
      ({ type, port, ioType }) => right({ type, port, ioType })
    )
    .with(
      { type: wedo2EventAttachedIoType.ATTACHED_VIRTUAL },
      ({ type, port }) => right({ type, port })
    )
    .otherwise(() =>
      left(new Error('ble: [attachedIo]: неизвестный event type'))
    );
};

export const getDevice = (
  ioType: Wedo2IoType,
  port: Wedo2PhysicalPort
): Option<Wedo2PhysicalDevice> =>
  match(ioType)
    .with(wedo2IoType.MOTOR, () =>
      some({
        tag: 'motor',
        ioType: wedo2IoType.MOTOR,
        port,
      } as const)
    )
    .with(wedo2IoType.EXTERNAL_TILT, () =>
      some({
        tag: 'tilt',
        mode: wedo2TiltSensorMode.TILT,
        measurement: wedo2MeasurementUnit.SI,
        ioType: wedo2IoType.EXTERNAL_TILT,
        port,
      } as const)
    )
    .with(wedo2IoType.DISTANCE, () =>
      some({
        tag: 'distance',
        mode: wedo2DistanceSensorMode.DETECT,
        measurement: wedo2MeasurementUnit.SI,
        ioType: wedo2IoType.DISTANCE,
        port,
      } as const)
    )
    .otherwise(() => none);
