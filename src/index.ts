import log from 'loglevel';

import { connect, setAttachedIoListener } from './connection';

const bootstrap = () =>
  connect().then(setAttachedIoListener((a) => console.log(a)));

log.setDefaultLevel('debug');
bootstrap();
