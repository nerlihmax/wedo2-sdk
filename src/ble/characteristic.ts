import * as R from 'ramda';
import noble from '@abandonware/noble';

import { ConnectionConnected } from './connection';
import { UUID } from './gatt';

const findByUuid = (uuid: UUID) => R.propEq('uuid', uuid);

export const findCharacteristic = (
  connection: ConnectionConnected<unknown>,
  uuid: UUID
): noble.Characteristic => {
  // const service = peripheral.services.find((s) =>
  //   s.characteristics.find(findByUuid(uuid))
  // );

  // const characteristic = service?.characteristics.find(findByUuid(uuid));
  const characteristic = connection.characteristics.find(findByUuid(uuid));

  if (!characteristic) {
    throw new Error(`куда-то пропала gatt-характеристика ${uuid}`);
  }

  return characteristic;
};

type Subscribe = (
  connection: ConnectionConnected<unknown>,
  uuid: UUID
) => Promise<void>;
export const subscribe: Subscribe = async (connection, characteristicUuid) => {
  const chars = [characteristicUuid];
  await Promise.all(
    chars.map((char) => findCharacteristic(connection, char).notifyAsync(true))
  );
};

type SetNotificationCallback = (
  connection: ConnectionConnected<unknown>,
  uuid: UUID,
  callback: (buffer: Buffer) => void
) => void;
export const addNotificationCallback: SetNotificationCallback = (
  connection,
  characteristic,
  callback
) => findCharacteristic(connection, characteristic).on('data', callback);
