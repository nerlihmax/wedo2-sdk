import log from 'loglevel';

import { profile } from '../../gatt';
import { write } from '../../characteristic';
import { Wedo2ConnectionConnected } from '../../connection/types';
import { Wedo2Motor } from '../devices/motor';
import { number } from 'fp-ts';

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
