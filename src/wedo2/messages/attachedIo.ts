import { Either, left, right } from 'fp-ts/lib/Either';
import { match } from 'ts-pattern';

import { Wedo2Port } from '../devices';

type Wedo2EventAttachedIoType = {
  DETACHED: 0;
  ATTACHED: 1;
  ATTACHED_VIRTUAL: 2;
};
const wedo2EventAttachedIoType: Wedo2EventAttachedIoType = {
  DETACHED: 0,
  ATTACHED: 1,
  ATTACHED_VIRTUAL: 2,
};

export type Wedo2EventAttachedIo =
  | Wedo2EventAttachedIoDetach
  | Wedo2EventAttachedIoAttach
  | Wedo2EventAttachedIoAttachedVirtual;

type Wedo2EventAttachedIoDetach = {
  type: Wedo2EventAttachedIoType['DETACHED'];
  port: Wedo2Port;
};

type Wedo2EventAttachedIoAttach = {
  type: Wedo2EventAttachedIoType['ATTACHED'];
  port: Wedo2Port;
};

type Wedo2EventAttachedIoAttachedVirtual = {
  type: Wedo2EventAttachedIoType['ATTACHED_VIRTUAL'];
  port: Wedo2Port;
};

export const parseAttachedIo = (
  data: Buffer
): Either<Error, Wedo2EventAttachedIo> => {
  const value = [...data];

  const port = value[0];
  const event = value[1];

  return match({ port, event })
    .with({ event: wedo2EventAttachedIoType.DETACHED }, ({ port }) =>
      right({ type: wedo2EventAttachedIoType.DETACHED, port })
    )
    .with({ event: wedo2EventAttachedIoType.ATTACHED }, ({ port }) =>
      right({ type: wedo2EventAttachedIoType.ATTACHED, port })
    )
    .with({ event: wedo2EventAttachedIoType.ATTACHED_VIRTUAL }, ({ port }) =>
      right({ type: wedo2EventAttachedIoType.ATTACHED_VIRTUAL, port })
    )
    .otherwise(() =>
      left(new Error('неизвестный event-type в eventAttachedIO'))
    );
};
