import type {
  Wedo2PhysicalPort,
  Wedo2PhysicalDevice,
  Wedo2NoDevice,
} from '@/devices';

// TODO: warp in either
export type Wedo2Connection<T> =
  | Wedo2ConnectionConnected<T>
  | Wedo2ConnectionDisconnected;

export type Wedo2ConnectionConnected<T> = {
  backend: T;
  deviceName: string;
  state: 'connected';
  ports: Record<Wedo2PhysicalPort, Wedo2PhysicalDevice | Wedo2NoDevice>;
};

export type Wedo2ConnectionDisconnected = {
  state: 'disconnected';
};
