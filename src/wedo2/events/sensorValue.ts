import { match } from 'ts-pattern';
import { Either, right, left, isLeft } from 'fp-ts/lib/Either';

import { Wedo2ConnectionConnected } from '../../connection/types';
import {
  Wedo2TiltSensor,
  wedo2TiltSensorDirection,
  Wedo2TiltSensorDirection,
} from '../devices/tilt';
import { isPortPhysical } from './attachedIo';
import { Wedo2DistanceSensor } from '../devices/distance';

export type Wedo2EventSensorValue =
  | Wedo2TiltSensorValue
  | Wedo2DistanceSensorValue;

export type Wedo2TiltSensorValue = {
  device: Wedo2TiltSensor;
  direction: Wedo2TiltSensorDirection;
};

export type Wedo2DistanceSensorValue = {
  device: Wedo2DistanceSensor;
  distance: number;
};

const matchTiltDirection = (
  direction: [number, number]
): Either<Error, Wedo2TiltSensorDirection> =>
  match(direction)
    .with([0x00, 0x00], () => right(wedo2TiltSensorDirection.NETURAL))
    .with([0x40, 0x40], () => right(wedo2TiltSensorDirection.BACKWARD))
    .with([0xa0, 0x40], () => right(wedo2TiltSensorDirection.RIGHT))
    .with([0xe0, 0x40], () => right(wedo2TiltSensorDirection.LEFT))
    .with([0x10, 0x41], () => right(wedo2TiltSensorDirection.FORWARD))

    .otherwise(() =>
      left(new Error('tiltSensor: получено неизвестное направление наклона'))
    );

export const parseSensorValue = (
  data: Buffer,
  ports: Wedo2ConnectionConnected['ports']
): Either<Error, Wedo2EventSensorValue> => {
  const value = [...data];

  const port = value[1];
  if (!isPortPhysical(port))
    return left(
      new Error('ble: [sensorValue]: пришло значение не с физического порта')
    );

  const device = ports[port];

  return match(device)
    .with({ tag: 'tilt' }, (device) => {
      const dir = matchTiltDirection([value[4], value[5]]);
      return isLeft(dir) ? dir : right({ direction: dir.right, device });
    })
    .with({ tag: 'distance' }, (device) => {
      const buffer = new ArrayBuffer(4);
      value.slice(2, 6).reduce((acc, curr, idx) => {
        acc[idx] = curr;
        return acc;
      }, new Uint8Array(buffer));
      const distance = new Float32Array(buffer)[0];

      return right({ distance, device });
    })
    .with({ tag: 'noDevice' }, () =>
      left(
        new Error(
          'ble: [sensorValue]: пришло значение датчика, который не добавлен в conn.ports'
        )
      )
    )
    .exhaustive();
};
