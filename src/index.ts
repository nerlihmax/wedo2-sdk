import * as R from 'ramda';

import { connect } from './connection';
import { notify } from './characterictic';
import { profile } from './gatt';

const bootstrap = async () => {
  const connection = await connect();

  await notify(
    connection,
    profile.ioService.uuid,
    profile.ioService.characteristics.valueFormat
  );
};

bootstrap();
