import { match } from 'ts-pattern';
import { getLogger } from 'loglevel';
const log = getLogger('wedo2-sdk');
import { profile } from '@wedo2-sdk/shared';

import type {
  Wedo2BleBackend,
  Wedo2ConnectionConnected,
  Wedo2Device,
  Wedo2Motor,
  Wedo2NoDevice,
} from '@wedo2-sdk/shared';

/*
 * from rev-eng guide (in hex):
 *  01          02            01          22       01    01 00 00 00               02    01
 * (COMMAND ID, COMMAND TYPE, CONNECT ID, TYPE ID, MODE, DELTA INTERVAL (4 BYTES), UNIT, NOTIFICATIONS ENABLED).
 */
export const registerDevice = async (
  connection: Wedo2ConnectionConnected<Wedo2BleBackend>,
  device: Exclude<Wedo2Device, Wedo2NoDevice | Wedo2Motor>
): Promise<void> => {
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

  await connection.backend.write(
    profile.services.ioService.characteristics.inputCommand,
    payload
  );
};
