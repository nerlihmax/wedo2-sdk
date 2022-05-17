import { Values } from '../../utils';
import { Wedo2BaseSensor } from './index';

export type Wedo2DistanceSensorMode = typeof wedo2DistanceSensorMode;
export const wedo2DistanceSensorMode = {
  DETECT: 0,
  COUNT: 1,
} as const;

export type Wedo2DistanceSensor = Wedo2BaseSensor & {
  _tag: 'distance';
  mode: Values<Wedo2DistanceSensorMode>;
};
