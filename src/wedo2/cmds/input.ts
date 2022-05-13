import { ConnectionConnected } from 'src/ble/connection';
import { Wedo2Sensor } from '../devices/sensor';
import { match } from 'ts-pattern';
import { profile } from '../gatt';
import { write } from 'src/ble/characteristic';

type RegisterSensor = <Profile>(
  sensor: Wedo2Sensor
) => (
  connection: ConnectionConnected<Profile>
) => Promise<ConnectionConnected<Profile>>;
/*
 * (COMMAND ID, COMMAND TYPE, CONNECT ID, TYPE ID, MODE, DELTA INTERVAL (4 BYTES), UNIT, NOTIFICATIONS ENABLED).
 */
export const registerSensor: RegisterSensor =
  (sensor) => async (connection) => {
    const data = match<Wedo2Sensor, number[]>(sensor)
      // первый байт delta ставим 1 что бы спамило
      .with({ _tag: 'tilt' }, (s) => [
        1,
        2,
        s.port,
        s.ioType,
        s.mode,
        1, // включить дельта кодирование
        0,
        0,
        0,
        s.measurement,
        1, // включить нотификации
      ])
      .exhaustive();

    await write(
      connection,
      profile.services.ioService.characteristics.inputCommand,
      data
    );

    return connection;
  };
