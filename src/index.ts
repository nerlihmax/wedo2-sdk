import M from 'ts-pattern';

import {
  addNotificationListener,
  connect,
  setupNotifications,
} from './wedo2/connection';
import { profile } from './wedo2/gatt';

const matchAttachedIo = () => console.log();

const bootstrap = () =>
  connect()
    .then(setupNotifications)
    .then(
      addNotificationListener(
        profile.commonService.characteristics.attachedIo,
        () => console.log('received attachedIo')
      )
    );

bootstrap();
