import type { Peripheral, Characteristic } from '@abandonware/noble';

import type { Wedo2EventAttachedIoDetach } from '@/wedo2/events/attachedIo';
import type {
  Wedo2NoDevice,
  Wedo2PhysicalDevice,
  Wedo2PhysicalPort,
} from '@/wedo2/devices';
import type { Wedo2EventSensorValue } from '@/wedo2/events/sensorValue';

// TODO: warp in either
export type Wedo2Connection =
  | Wedo2ConnectionConnected
  | Wedo2ConnectionDisconnected;

export type Wedo2ConnectionConnected = {
  deviceName: string;
  state: 'connected';
  peripheral: Peripheral;
  characteristics: Characteristic[];
  ports: Record<Wedo2PhysicalPort, Wedo2PhysicalDevice | Wedo2NoDevice>;
};

export type Wedo2ConnectionDisconnected = {
  state: 'disconnected';
};

export type Connect = () => Promise<Wedo2ConnectionConnected>;

export type SetAttachIoListener = ({
  attach,
  detach,
}: {
  attach: (device: Wedo2PhysicalDevice) => void;
  detach: (device: Wedo2EventAttachedIoDetach) => void;
}) => (Wedo2connection: Wedo2ConnectionConnected) => Wedo2ConnectionConnected;

export type SetSensorValueListener = (
  listener: (value: Wedo2EventSensorValue) => void
) => (Wedo2connection: Wedo2ConnectionConnected) => Wedo2ConnectionConnected;
