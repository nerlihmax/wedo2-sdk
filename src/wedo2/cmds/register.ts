import { match } from 'ts-pattern';
import log from 'loglevel';

import { Wedo2ConnectionConnected } from '../../connection/types';
import { profile } from '../../gatt';
import { write } from '../../characteristic';
import { Wedo2Device, Wedo2NoDevice } from '../devices';
import { Wedo2Motor } from '../devices/motor';

/*
 * from rev-eng guide (in hex):
 *  01          02            01          22       01    01 00 00 00               02    01
 * (COMMAND ID, COMMAND TYPE, CONNECT ID, TYPE ID, MODE, DELTA INTERVAL (4 BYTES), UNIT, NOTIFICATIONS ENABLED).
 */
type RegisterDevice = (
  connection: Wedo2ConnectionConnected,
  device: Exclude<Wedo2Device, Wedo2NoDevice | Wedo2Motor>
) => Promise<void>;
export const registerDevice: RegisterDevice = async (connection, device) => {
  const payload = Buffer.from(
    match(device)
      .with({ tag: 'tilt' }, ({ port, ioType, mode, measurement }) => [
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
      .with({ tag: 'distance' }, ({ port, ioType, mode, measurement }) => [
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
      .with({ tag: 'led' }, ({ port, ioType }) => [
        1,
        2,
        port,
        ioType,
        0,
        1,
        0,
        0,
        0,
        2,
        1,
      ])
      .exhaustive()
  );

  // TODO: форматированный вывод девайсов в логи
  log.debug(`ble: регистрирую девайс ${device.tag} на порту ${device.port}`);

  await write(
    connection,
    profile.services.ioService.characteristics.inputCommand,
    payload
  );
};
