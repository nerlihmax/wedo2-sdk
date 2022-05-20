import log from 'loglevel';

import { profile } from '@/gatt';
import { write } from '@/characteristic';

import type { Wedo2Motor } from '@/wedo2/devices/motor';
import type { Wedo2ConnectionConnected } from '@/connection/types';

const motorCmd = 1;

/*
 * (CONNECT ID, SUB COMMAND, PAYLOAD_LENGTH, ...PAYLOAD).
 */

type SetMotorState = (
  motor: Wedo2Motor,
  power: number
) => (
  connection: Wedo2ConnectionConnected
) => Promise<Wedo2ConnectionConnected>;
export const setMotorState: SetMotorState =
  (motor, power) => async (connection) => {
    const payload = Buffer.from([motor.port, motorCmd, 1, power]);

    log.debug(`ble: отправляю команду мотору на порте ${motor.port}`);

    await write(
      connection,
      profile.services.ioService.characteristics.outputCommand,
      payload
    );

    return connection;
  };
