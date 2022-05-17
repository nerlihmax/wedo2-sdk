import { match } from 'ts-pattern';
import log from 'loglevel';

import { Wedo2ConnectionConnected } from '../../connection/types';
import { profile } from '../../gatt';
import { write } from '../../characteristic';
import { Wedo2Device } from '../devices';

/*
 * from rev-eng guide (in hex):
 *  01          02            01          22       01    01 00 00 00               02    01
 * (COMMAND ID, COMMAND TYPE, CONNECT ID, TYPE ID, MODE, DELTA INTERVAL (4 BYTES), UNIT, NOTIFICATIONS ENABLED).
 */
type RegisterDevice = (
  connection: Wedo2ConnectionConnected,
  device: Wedo2Device
) => Promise<Wedo2ConnectionConnected>;
export const registerDevice: RegisterDevice = async (connection, device) => {
  const payload = Buffer.from(
    match(device)
      .with({ _tag: 'tilt' }, ({ port, ioType, mode, measurement }) => [
        1,
        2,
        port,
        ioType,
        mode,
        1,
        0,
        0,
        0,
        measurement,
        1,
      ])
      .with({ _tag: 'distance' }, ({ port, ioType, mode, measurement }) => [
        1,
        2,
        port,
        ioType,
        mode,
        1,
        0,
        0,
        0,
        measurement,
        1,
      ])
      .exhaustive()
  );

  // TODO: форматированный вывод девайсов в логи
  log.debug('ble: регистрирую девайс');

  await write(
    connection,
    profile.services.ioService.characteristics.inputCommand,
    payload
  );

  return connection;
};
