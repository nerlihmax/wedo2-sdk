import log from 'loglevel';
import { tap } from 'ramda';
import { match } from 'ts-pattern';

import {
  connect,
  setAttachIoListener,
  setSensorValueListener,
} from './connection';
import { setLedColor } from './wedo2/cmds/led';
import { wedo2LedColor } from './wedo2/devices/led';
import { wedo2TiltSensorDirection } from './wedo2/devices/tilt';

const wait =
  (timeout: number) =>
  <T>(t: T) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(t), timeout));

log.setDefaultLevel(
  (process.env.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);

connect()
  .then(
    tap((conn) =>
      console.log(`\nuserspace: подключился к устройству ${conn.deviceName}\n`)
    )
  )
  .then(
    setAttachIoListener({
      attach: (device) =>
        console.log(
          `\nuserspace: подключено ${device.tag} устройство в порт ${device.port}\n`
        ),
      detach: (event) =>
        console.log(
          `\nuserspace: из порта ${event.port} отключено устройство\n`
        ),
    })
  )
  .then(
    setSensorValueListener((value, device) =>
      match(device.tag)
        .with('tilt', () =>
          log.info(
            `[sensorValue]: датчик наклона наклонен ${match(value.direction)
              .with(wedo2TiltSensorDirection.BACKWARD, () => 'назад')
              .with(wedo2TiltSensorDirection.FORWARD, () => 'вперед')
              .with(wedo2TiltSensorDirection.LEFT, () => 'влево')
              .with(wedo2TiltSensorDirection.RIGHT, () => 'направо')
              .with(wedo2TiltSensorDirection.NETURAL, () => 'нейтрально')
              .exhaustive()}`
          )
        )
        .with('distance', () => log.info('у меня лапки на дистанс сенсор'))
        .exhaustive()
    )
  )
  .then(setLedColor(wedo2LedColor.RED))
  .then(wait(1000))
  .then(setLedColor(wedo2LedColor.YELLOW))
  .then(wait(1000))
  .then(setLedColor(wedo2LedColor.GREEN));
