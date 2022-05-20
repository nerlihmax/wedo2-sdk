import type { Values } from '../../utils';
import type { Wedo2BasePhysicalDevice, Wedo2BaseSensor } from './index';

export type Wedo2DistanceSensorMode = Values<typeof wedo2DistanceSensorMode>;
export const wedo2DistanceSensorMode = {
  DETECT: 0,
  COUNT: 1,
} as const;

export type Wedo2DistanceSensor = Wedo2BasePhysicalDevice &
  Wedo2BaseSensor & {
    tag: 'distance';
    mode: Wedo2DistanceSensorMode;
  };
