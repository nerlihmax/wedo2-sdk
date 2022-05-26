import {
  connect,
  setSensorValueListener,
  setAttachIoListener,
} from '@/backend';
import { setLedColor } from '@/cmds/led';
import { setMotorState } from '@/cmds/motor';
import {
  wedo2PhysicalPort,
  wedo2LedColor,
  wedo2TiltSensorDirection,
} from '@wedo2-sdk/shared';
import { getLogger } from 'loglevel';
const log = getLogger('wedo2-sdk');

export {
  connect,
  setAttachIoListener,
  setSensorValueListener,
  setLedColor,
  setMotorState,
  wedo2PhysicalPort,
  wedo2LedColor,
  wedo2TiltSensorDirection,
};

import type {
  Wedo2LedColor,
  Wedo2PhysicalPort,
  Wedo2TiltSensorDirection,
} from '@wedo2-sdk/shared';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const process = require('node:process');
log.setLevel(
  (process.env?.NODE_ENV ?? 'production') === 'production' ? 'silent' : 'debug'
);
log.debug('[wedo2-sdk]: библиотека запущена в debug-режиме');

export type { Wedo2LedColor, Wedo2PhysicalPort, Wedo2TiltSensorDirection };
