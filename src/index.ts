import log from 'loglevel';

import { connect, addPortAttachmentsListener } from './connection';

const bootstrap = () =>
  connect().then(
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
  );

log.setDefaultLevel(
  (process.env.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);
bootstrap();
