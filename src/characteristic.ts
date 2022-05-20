import * as R from 'ramda';
import log from 'loglevel';

import type { Characteristic } from '@abandonware/noble';

import type { Wedo2ConnectionConnected } from './connection/types';
import type { UUID } from './gatt';

const findByUuid = (uuid: UUID) => R.propEq('uuid', uuid);

const findCharacteristic = (
  connection: Wedo2ConnectionConnected,
  char: UUID
): Characteristic => {
  const characteristic = connection.characteristics.find(findByUuid(char));

  if (!characteristic) {
    throw new Error(`куда-то пропала gatt-характеристика ${char}`);
  }

  return characteristic;
};

type Subscribe = (
  connection: Wedo2ConnectionConnected,
  char: UUID
) => Promise<void>;
export const subscribe: Subscribe = (connection, char) => {
  log.debug(`ble: подписался нотификации на ${char.slice(4, 8)}`);

  return findCharacteristic(connection, char).notifyAsync(true);
};

type Write = (
  connection: Wedo2ConnectionConnected,
  char: UUID,
  payload: Buffer,
  withResponse?: boolean
) => Promise<void>;
export const write: Write = async (
  connection,
  char,
  payload,
  withResponse = false
) => {
  log.debug(`ble: отправляю команду на ${char.slice(4, 8)}`, payload);

  findCharacteristic(connection, char).writeAsync(payload, withResponse);
};

type SetNotificationCallback = (
  connection: Wedo2ConnectionConnected,
  char: UUID,
  callback: (buffer: Buffer) => void
) => void;
export const addNotificationCallback: SetNotificationCallback = (
  connection,
  char,
  callback
) => findCharacteristic(connection, char).on('data', callback);
