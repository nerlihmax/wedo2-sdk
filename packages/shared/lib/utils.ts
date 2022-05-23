import type {
  Wedo2PhysicalPort,
  Wedo2NoDevice,
  Wedo2PhysicalDevice,
  Wedo2Motor,
} from '@/devices';

export type Values<T> = T[keyof T];

export const getNoDevice = (port: Wedo2PhysicalPort): Wedo2NoDevice => ({
  tag: 'noDevice',
  port,
});

export function isMotor(device: Wedo2PhysicalDevice): device is Wedo2Motor {
  return device.tag === 'motor';
}
