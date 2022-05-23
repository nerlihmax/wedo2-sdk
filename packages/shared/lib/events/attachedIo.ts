import type { Either } from 'fp-ts/Either';
import type { Option } from 'fp-ts/Option';

import type { Wedo2IoType, Wedo2PhysicalPort, Wedo2Port } from '@/devices';

export type Wedo2EventAttachedIoType = typeof wedo2EventAttachedIoType;
export const wedo2EventAttachedIoType = {
  DETACHED: 0,
  ATTACHED: 1,
  ATTACHED_VIRTUAL: 2,
} as const;

export type Wedo2EventAttachedIo =
  | Wedo2EventAttachedIoDetach
  | Wedo2EventAttachedIoAttach
  | Wedo2EventAttachedIoAttachedVirtual;

export type Wedo2EventAttachedIoDetach = {
  type: Wedo2EventAttachedIoType['DETACHED'];
  port: Wedo2Port;
};

export type Wedo2EventAttachedIoAttach = {
  type: Wedo2EventAttachedIoType['ATTACHED'];
  port: Wedo2Port;
  ioType: Wedo2IoType;
};

export type Wedo2EventAttachedIoAttachedVirtual = {
  type: Wedo2EventAttachedIoType['ATTACHED_VIRTUAL'];
  port: Wedo2Port;
};

export type ParseAttachedIo = (
  data: Buffer
) => Either<Error, Wedo2EventAttachedIo>;

export type GetDevice = (
  ioType: Wedo2IoType,
  port: Wedo2PhysicalPort
) => Option<Wedo2PhysicalPort>;
