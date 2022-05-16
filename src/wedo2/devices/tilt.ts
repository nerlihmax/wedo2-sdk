import { Values } from 'src/utils';
import { Wedo2BaseSensor } from './index';

export type Wedo2TiltSensorMode = typeof wedo2TiltSensorMode;
export const wedo2TiltSensorMode = {
  ANGLE: 0,
  TILT: 1,
  CRASH: 2,
} as const;

export type Wedo2TiltSensor = Wedo2BaseSensor & {
  _tag: 'tilt';
  mode: Values<Wedo2TiltSensorMode>;
};
