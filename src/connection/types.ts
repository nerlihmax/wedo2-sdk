import noble from '@abandonware/noble';

import { Wedo2Device } from 'src/wedo2/devices';
import { Wedo2EventSensorValue } from 'src/wedo2/events/sensorValue';

// warp in either
export type Wedo2Connection =
  | Wedo2ConnectionConnected
  | Wedo2ConnectionDisconnected;

export type Wedo2ConnectionConnected = {
  state: 'connected';
  peripheral: noble.Peripheral;
  characteristics: noble.Characteristic[];
};

export type Wedo2ConnectionDisconnected = {
  state: 'disconnected';
};

export type Connect = () => Promise<Wedo2ConnectionConnected>;

export type SetAttachedIoListener = (
  listener: (device: Wedo2Device) => void
) => (
  Wedo2connection: Wedo2ConnectionConnected
) => Promise<Wedo2ConnectionConnected>;

export type SetSensorValueListener = (
  listener: (event: Wedo2EventSensorValue) => void
) => (
  Wedo2connection: Wedo2ConnectionConnected
) => Promise<Wedo2ConnectionConnected>;

export type SendInputCommand = () => (
  Wedo2connection: Wedo2ConnectionConnected
) => Promise<Wedo2ConnectionConnected>;
