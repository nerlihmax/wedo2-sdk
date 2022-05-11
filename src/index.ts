import { addNotifyListener, connect, setupNotifications } from './ble/connection';

const bootstrap = () => {
  const connection = connect().then(setupNotifications)
  .then(c => addNotifyListener(c.gatt.));
};

bootstrap();
