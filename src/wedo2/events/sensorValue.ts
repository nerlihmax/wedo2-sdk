import { match } from 'ts-pattern';
import { Either, right, left, isLeft } from 'fp-ts/lib/Either';

import { Wedo2ConnectionConnected } from '../../connection/types';
import {
  wedo2TiltSensorDirection,
  Wedo2TiltSensorDirection,
} from '../devices/tilt';
import { isDevicePhysical, isPortPhysical } from './attachedIo';
import { Wedo2PhysicalPort } from '../devices';

export type Wedo2EventSensorValue = Wedo2TiltSensorValue;

type Wedo2EventSensorBaseValue = { port: Wedo2PhysicalPort };

export type Wedo2TiltSensorValue = Wedo2EventSensorBaseValue & {
  direction: Wedo2TiltSensorDirection;
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
    .with({ tag: 'tilt' }, () => {
      const dir = matchTiltDirection([value[4], value[5]]);
      return isLeft(dir) ? dir : right({ port, direction: dir.right });
    })
    .otherwise(() =>
      left(
        new Error(
          `ble: [sensorValue]: обработка датчика ${device.tag} не реализована`
        )
      )
    );
};
