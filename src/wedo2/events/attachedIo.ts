import { Either, right, left } from 'fp-ts/lib/Either';
import { Option, some, none } from 'fp-ts/lib/Option';
import { match } from 'ts-pattern';

import {
  Wedo2Device,
  wedo2IoType,
  Wedo2IoType,
  wedo2MeasurementUnit,
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

export const getDeviceFromEvent = (
  event: Wedo2EventAttachedIoAttach
): Option<Wedo2Device> =>
  match(event)
    .with({ ioType: wedo2IoType.EXTERNAL_TILT }, ({ ioType, port }) =>
      some({
        _tag: 'tilt',
        mode: wedo2TiltSensorMode.TILT,
        measurement: wedo2MeasurementUnit.SI,
        ioType,
        port,
      } as const)
    )
    .with({ ioType: wedo2IoType.DISTANCE }, ({ ioType, port }) =>
      some({
        _tag: 'distance',
        mode: wedo2DistanceSensorMode.DETECT,
        measurement: wedo2MeasurementUnit.SI,
        ioType,
        port,
      } as const)
    )
    .otherwise(() => none);
