import { Either, right, left } from 'fp-ts/lib/Either';
import { Option, some, none } from 'fp-ts/Option';
import { match } from 'ts-pattern';

import {
  Wedo2Device,
  wedo2IoType,
  Wedo2IoType,
  wedo2MeasurementUnit,
  Wedo2PhysicalDevice,
  Wedo2PhysicalPort,
  wedo2PhysicalPort,
  Wedo2Port,
} from '../devices';
import { wedo2DistanceSensorMode } from '../devices/distance';
import { wedo2TiltSensorMode } from '../devices/tilt';

type Wedo2EventAttachedIoType = typeof wedo2EventAttachedIoType;
export const wedo2EventAttachedIoType = {
  DETACHED: 0,
  ATTACHED: 1,
  ATTACHED_VIRTUAL: 2,
} as const;

export type Wedo2EventAttachedIo =
  | Wedo2EventAttachedIoDetach
  | Wedo2EventAttachedIoAttach
  | Wedo2EventAttachedIoAttachedVirtual;

export type Wedo2EventAttachedIoDetach = {
  type: Wedo2EventAttachedIoType['DETACHED'];
  port: Wedo2Port;
};

export type Wedo2EventAttachedIoAttach = {
  type: Wedo2EventAttachedIoType['ATTACHED'];
  port: Wedo2Port;
  ioType: Wedo2IoType;
};

export type Wedo2EventAttachedIoAttachedVirtual = {
  type: Wedo2EventAttachedIoType['ATTACHED_VIRTUAL'];
  port: Wedo2Port;
};

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

export const configureDevice = (
  ioType: Wedo2IoType,
  port: Wedo2PhysicalPort
): Option<Wedo2PhysicalDevice> =>
  match(ioType)
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
