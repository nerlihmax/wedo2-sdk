import { UUID } from '@/gatt';
import { Wedo2ConnectionConnected } from '@/backend/connection';

export type Wedo2BleBackend<T> = {
  _conn: T;
  connect: () => Promise<Wedo2ConnectionConnected<Wedo2BleBackend<T>>>;
  subscribe: (char: UUID) => Promise<void>;
  write: (char: UUID, payload: Buffer) => Promise<void>;
  addNotificationCallback: (
    char: UUID,
    callback: (data: Buffer) => void
  ) => Promise<void>;
};
