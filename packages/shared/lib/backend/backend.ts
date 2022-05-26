import { UUID } from '@/gatt';

export type Wedo2BleBackend = {
  deviceName: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onDisconnect(callback: () => void): void;
  subscribe(char: UUID): Promise<void>;
  write(char: UUID, payload: Buffer): Promise<void>;
  addNotificationCallback(char: UUID, callback: (data: Buffer) => void): void;
};
