import * as R from 'ramda';
import noble from '@abandonware/noble';

import { ConnectionConnected } from './connection';
import { UUID } from './gatt';

const findByUuid = (uuid: UUID) => R.propEq('uuid', uuid);

const findCharacteristic = (
  connection: ConnectionConnected<unknown>,
  char: UUID
): noble.Characteristic => {
  const characteristic = connection.characteristics.find(findByUuid(char));

  if (!characteristic) {
    throw new Error(`куда-то пропала gatt-характеристика ${char}`);
  }

  return characteristic;
};

type Subscribe = (
  connection: ConnectionConnected<unknown>,
  char: UUID
) => Promise<void>;
export const subscribe: Subscribe = async (connection, char) => {
  const chars = [char];
  await Promise.all(
    chars.map((char) => findCharacteristic(connection, char).notifyAsync(true))
  );
};

type Write = (
  connection: ConnectionConnected<unknown>,
  char: UUID,
  payload: number[],
  withResponse?: boolean
) => Promise<void>;
export const write: Write = async (
  connection,
  char,
  payload,
  withResponse = false
) =>
  findCharacteristic(connection, char).writeAsync(
    Buffer.from(payload),
    withResponse
  );

type SetNotificationCallback = (
  connection: ConnectionConnected<unknown>,
  char: UUID,
  callback: (buffer: Buffer) => void
) => void;
export const addNotificationCallback: SetNotificationCallback = (
  connection,
  characteristic,
  callback
) => findCharacteristic(connection, characteristic).on('data', callback);
