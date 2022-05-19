import log from 'loglevel';
import { tap } from 'ramda';
import { match } from 'ts-pattern';

import {
  connect,
  setAttachIoListener,
  setSensorValueListener,
  setMotorState,
  wedo2PhysicalPort,
  wedo2TiltSensorDirection,
  setLedColor,
  wedo2LedColor,
} from '../src/index';

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
  .then(setLedColor(wedo2LedColor.GREEN))
  .then(
    setSensorValueListener((value) =>
      console.log(
        `\nuserspace: ${`${match(value)
          .with(
            { device: { tag: 'tilt' } },
            (value) =>
              `датчик наклона наклонен ${match(value.direction)
                .with(wedo2TiltSensorDirection.BACKWARD, () => 'назад')
                .with(wedo2TiltSensorDirection.FORWARD, () => 'вперед')
                .with(wedo2TiltSensorDirection.LEFT, () => 'влево')
                .with(wedo2TiltSensorDirection.RIGHT, () => 'направо')
                .with(wedo2TiltSensorDirection.NETURAL, () => 'нейтрально')
                .exhaustive()}`
          )
          .with(
            { device: { tag: 'distance' } },
            (value) => `датчик растояния отдален на ${value.distance}`
          )
          .exhaustive()}`}\n`
      )
    )
  )
  .then(wait(10000))
  .then(
    tap((conn) => {
      console.log('включаю мотор');
      console.log('порты: ', conn.ports);

      const device = conn.ports[wedo2PhysicalPort.PORT1];
      if (device.tag === 'motor') {
        setMotorState(device, -80)(conn);
      }
    })
  );
