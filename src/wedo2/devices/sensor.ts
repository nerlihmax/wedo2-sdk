import { Values } from 'src/utils';
import { Wedo2IoType, Wedo2MeasurementUnit, Wedo2Port } from '.';

export type Wedo2TiltSensorMode = typeof wedo2TiltSensorMode;
export const wedo2TiltSensorMode = {
  ANGLE: 0x0,
  TITL: 0x1,
  CRASH: 0x2,
} as const;

type Wedo2BaseSensor = {
  port: Wedo2Port;
  measurement: Wedo2MeasurementUnit;
  ioType: Wedo2IoType;
};

export type Wedo2Sensor = Wedo2TiltSensor;

export type Wedo2TiltSensor = Wedo2BaseSensor & {
  _tag: 'tilt';
  mode: Values<Wedo2TiltSensorMode>;
};
