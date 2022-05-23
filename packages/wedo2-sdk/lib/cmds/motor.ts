import log from 'loglevel';
import { profile } from '@wedo2-sdk/shared';

import type {
  Wedo2BleBackend,
  Wedo2ConnectionConnected,
  Wedo2Motor,
} from '@wedo2-sdk/shared';

const motorCmd = 1;

/*
 * (CONNECT ID, SUB COMMAND, PAYLOAD_LENGTH, ...PAYLOAD).
 */

export const setMotorState =
  (motor: Wedo2Motor, power: number) =>
  async (
    connection: Wedo2ConnectionConnected<Wedo2BleBackend<unknown>>
  ): Promise<Wedo2ConnectionConnected<Wedo2BleBackend<unknown>>> => {
    const payload = Buffer.from([motor.port, motorCmd, 1, power]);

    log.debug(`ble: отправляю команду мотору на порте ${motor.port}`);

    await connection.backend.write(
      connection,
      profile.services.ioService.characteristics.outputCommand,
      payload
    );

    return connection;
  };
