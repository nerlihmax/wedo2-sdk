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

export type { Wedo2LedColor, Wedo2PhysicalPort, Wedo2TiltSensorDirection };
