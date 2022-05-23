import { match } from 'ts-pattern';
import { right, left, isLeft } from 'fp-ts/Either';
import { wedo2TiltSensorDirection } from '@wedo2-sdk/shared';
import { isPortPhysical } from './attachedIo';

import type { Either } from 'fp-ts/Either';
import type {
  Wedo2TiltSensorDirection,
  Wedo2ConnectionConnected,
  Wedo2EventSensorValue,
  Wedo2BleBackend,
} from '@wedo2-sdk/shared';

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
  ports: Wedo2ConnectionConnected<Wedo2BleBackend<unknown>>['ports']
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
    .otherwise((device) =>
      left(
        new Error(
          `ble: [sensorValue]: пришло значение не с сенсора, а с ${device.tag}, скипаем`
        )
      )
    );
};
