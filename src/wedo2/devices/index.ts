import { Values } from 'src/utils';

export type Wedo2Device = {
  LED: 23;
  TILT: 34;
};
export const wedo2Device: Wedo2Device = {
  LED: 23,
  TILT: 34,
};

export type Wedo2MeasurementUnit = {
  RAW: 0;
  DISTANCE: 1;
  SI: 2;
};
export const wedo2MeasurementUnit: Wedo2MeasurementUnit = {
  RAW: 0,
  DISTANCE: 1,
  SI: 2,
};

export type Wedo2Port = Values<Wedo2PhysicalPort> | Wedo2VirtualPort;

export type Wedo2PhysicalPort = {
  PORT1: 0;
  PORT2: 1;
};
export const wedo2PhysicalPort: Wedo2PhysicalPort = {
  PORT1: 0,
  PORT2: 1,
};

// TODO: enumerate all supported virtual devices
export type Wedo2VirtualPort = number;
