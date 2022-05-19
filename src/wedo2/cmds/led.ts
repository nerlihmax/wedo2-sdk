import log from 'loglevel';

import { profile } from '../../gatt';
import { write } from '../../characteristic';
import { Wedo2ConnectionConnected } from '../../connection/types';
import { wedo2Led, Wedo2LedColor } from '../devices/led';

const ledCmd = 4;

/*
 * (CONNECT ID, SUB COMMAND, PAYLOAD_LENGTH, ...PAYLOAD).
 */

type SetLedColor = (
  color: Wedo2LedColor
) => (
  connection: Wedo2ConnectionConnected
) => Promise<Wedo2ConnectionConnected>;
export const setLedColor: SetLedColor = (color) => async (connection) => {
  const payload = Buffer.from([wedo2Led.port, ledCmd, 1, color]);

  log.debug('ble: ставлю цвет светодиоду');

  await write(
    connection,
    profile.services.ioService.characteristics.outputCommand,
    payload
  );

  return connection;
};
