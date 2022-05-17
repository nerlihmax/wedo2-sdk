import noble from '@abandonware/noble';
import { Wedo2EventAttachedIoDetach } from 'src/wedo2/events/attachedIo';

import { Wedo2Device } from '../wedo2/devices';
import { Wedo2EventSensorValue } from '../wedo2/events/sensorValue';

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

export type AddPortAttachmentsListener = ({
  attach,
  detach,
}: {
  attach: (device: Wedo2Device) => void;
  detach: (device: Wedo2EventAttachedIoDetach) => void;
}) => (
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
