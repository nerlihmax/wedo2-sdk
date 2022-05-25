import log from 'loglevel';
import { profile, wedo2Led } from '@wedo2-sdk/shared';

import type {
  Wedo2BleBackend,
  Wedo2ConnectionConnected,
  Wedo2LedColor,
} from '@wedo2-sdk/shared';

const ledCmd = 4;

/*
 * (CONNECT ID, SUB COMMAND, PAYLOAD_LENGTH, ...PAYLOAD).
 */

export const setLedColor =
  (color: Wedo2LedColor) =>
  async (
    connection: Wedo2ConnectionConnected<Wedo2BleBackend<unknown>>
  ): Promise<Wedo2ConnectionConnected<Wedo2BleBackend<unknown>>> => {
    const payload = Buffer.from([wedo2Led.port, ledCmd, 1, color]);

    log.debug('ble: ставлю цвет светодиоду');

    await connection.backend.write(
      profile.services.ioService.characteristics.outputCommand,
      payload
    );

    return connection;
  };
