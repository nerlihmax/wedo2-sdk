import { Values } from '../../utils';
import { Wedo2DistanceSensor } from './distance';
import { Wedo2Led } from './led';
import { Wedo2Motor } from './motor';
import { Wedo2TiltSensor } from './tilt';

export type Wedo2Device =
  | Wedo2PhysicalDevice
  | Wedo2VirtualDevice
  | Wedo2NoDevice;

export type Wedo2PhysicalDevice = Wedo2PhysicalSensor | Wedo2Motor;

export type Wedo2PhysicalSensor = Wedo2DistanceSensor | Wedo2TiltSensor;

export type Wedo2VirtualDevice = Wedo2Led;

export type Wedo2NoDevice = { tag: 'noDevice'; port: Wedo2Port };

export type Wedo2BaseVirtualDevice = {
  port: Wedo2Port;
  ioType: Wedo2IoType;
};

export type Wedo2BasePhysicalDevice = {
  port: Wedo2PhysicalPort;
  ioType: Wedo2IoType;
};

export type Wedo2BaseSensor = {
  measurement: Wedo2MeasurementUnit;
};

export type Wedo2MeasurementUnit = Values<typeof wedo2MeasurementUnit>;
export const wedo2MeasurementUnit = {
  RAW: 0,
  DISTANCE: 1,
  SI: 2,
} as const;

export type Wedo2Port = Wedo2PhysicalPort | Wedo2VirtualPort;

export type Wedo2PhysicalPort = Values<typeof wedo2PhysicalPort>;
export const wedo2PhysicalPort = {
  PORT1: 1,
  PORT2: 2,
} as const;

export type Wedo2IoType = number | Values<typeof wedo2IoType>;
export const wedo2IoType = {
  MOTOR: 0x01,
  EXTERNAL_TILT: 0x22,
  DISTANCE: 0x23,
} as const;

export type Wedo2VirtualPort = number;
