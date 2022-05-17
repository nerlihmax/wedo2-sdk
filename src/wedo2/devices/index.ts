import { Values } from '../../utils';
import { Wedo2DistanceSensor } from './distance';
import { Wedo2TiltSensor } from './tilt';

export type Wedo2Device = Wedo2DistanceSensor | Wedo2TiltSensor;

export type Wedo2BaseSensor = {
  port: Wedo2Port;
  measurement: Wedo2MeasurementUnit;
  ioType: Wedo2IoType;
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
  PORT1: 0,
  PORT2: 1,
} as const;

export type Wedo2IoType = number | Values<typeof wedo2IoType>;
export const wedo2IoType = {
  EXTERNAL_TILT: 0x22,
  DISTANCE: 0x23,
} as const;

export type Wedo2VirtualPort = number;
