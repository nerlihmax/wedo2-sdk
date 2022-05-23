import { UUID } from '@/gatt';
import { Wedo2ConnectionConnected } from './connection';

export type Wedo2BleBackend<T> = {
  _conn: T;
  connect: () => Promise<Wedo2ConnectionConnected<Wedo2BleBackend<T>>>;
  subscribe: (
    connection: Wedo2ConnectionConnected<Wedo2BleBackend<T>>,
    char: UUID
  ) => Promise<void>;
  write: (
    connection: Wedo2ConnectionConnected<Wedo2BleBackend<T>>,
    char: UUID,
    payload: Buffer
  ) => Promise<void>;
  addNotificationCallback: (
    connection: Wedo2ConnectionConnected<Wedo2BleBackend<T>>,
    char: UUID,
    callback: (data: Buffer) => void
  ) => Promise<void>;
};
