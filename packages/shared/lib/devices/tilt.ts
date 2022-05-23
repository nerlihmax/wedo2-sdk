import type { Values } from '@/utils';
import type { Wedo2BasePhysicalDevice, Wedo2BaseSensor } from '@/devices';

export type Wedo2TiltSensorMode = Values<typeof wedo2TiltSensorMode>;
export const wedo2TiltSensorMode = {
  ANGLE: 0,
  TILT: 1,
  CRASH: 2,
} as const;

export type Wedo2TiltSensorDirection = Values<typeof wedo2TiltSensorDirection>;
export const wedo2TiltSensorDirection = {
  NETURAL: 0,
  BACKWARD: 3,
  RIGHT: 5,
  LEFT: 7,
  FORWARD: 9,
} as const;

export type Wedo2TiltSensor = Wedo2BasePhysicalDevice &
  Wedo2BaseSensor & {
    tag: 'tilt';
    mode: Wedo2TiltSensorMode;
  };
