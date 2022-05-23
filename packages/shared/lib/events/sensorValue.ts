import type { Either } from 'fp-ts/Either';

import type { Wedo2DistanceSensor } from '@/devices/distance';
import type { Wedo2TiltSensor, Wedo2TiltSensorDirection } from '@/devices/tilt';
import type { Wedo2ConnectionConnected } from '@/backend';

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

export type ParseSensorValue<T> = (
  data: Buffer,
  ports: Wedo2ConnectionConnected<T>['ports']
) => Either<Error, Wedo2EventSensorValue>;
