import { Values } from 'src/utils';

export type Wedo2Device = Values<typeof wedo2Device>;
export const wedo2Device = {
  LED: 0x23,
  TILT: 0x34,
} as const;

export type Wedo2MeasurementUnit = Values<typeof wedo2MeasurementUnit>;
export const wedo2MeasurementUnit = {
  RAW: 0x0,
  DISTANCE: 0x1,
  SI: 0x2,
} as const;

export type Wedo2Port = Wedo2PhysicalPort | Wedo2VirtualPort;

export type Wedo2PhysicalPort = Values<typeof wedo2PhysicalPort>;
export const wedo2PhysicalPort = {
  PORT1: 0x0,
  PORT2: 0x1,
} as const;

// TODO: hz vashe
export type Wedo2IoType = number | Values<typeof wedo2IoType>;
export const wedo2IoType = {
  EXTERNAL_TILT: 0x22,
} as const;

// TODO: enumerate all supported virtual devices
export type Wedo2VirtualPort = number;
