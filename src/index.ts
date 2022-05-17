import log from 'loglevel';
import { tap } from 'ramda';

import { connect, addPortAttachmentsListener } from './connection';
import { Wedo2ConnectionConnected } from './connection/types';
import { setLedColor } from './wedo2/cmds/led';
import { Wedo2LedColor, wedo2LedColor } from './wedo2/devices/led';

const wait =
  (timeout: number) =>
  <T>(t: T) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(t), timeout));

const bootstrap = () =>
  connect()
    .then(
      tap((conn) =>
        console.log(
          `\nuserspace: подключился к устройству ${conn.deviceName}\n`
        )
      )
    )
    .then(
      addPortAttachmentsListener({
        attach: (device) =>
          console.log(
            `\nuserspace: подключено ${device._tag} устройство в порт ${device.port}\n`
          ),
        detach: (event) =>
          console.log(
            `\nuserspace: из порта ${event.port} отключено устройство\n`
          ),
      })
    )
    .then(setLedColor(wedo2LedColor.RED))
    .then(wait(1000))
    .then(setLedColor(wedo2LedColor.YELLOW))
    .then(wait(1000))
    .then(setLedColor(wedo2LedColor.GREEN));

log.setDefaultLevel(
  (process.env.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);
bootstrap();
