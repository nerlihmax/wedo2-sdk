import {
  connect,
  setAttachIoListener,
  setSensorValueListener,
} from '@/connection';
import { setLedColor } from '@/wedo2/cmds/led';
import { setMotorState } from '@/wedo2/cmds/motor';
import { wedo2PhysicalPort } from '@/wedo2/devices';
import { wedo2LedColor } from '@/wedo2/devices/led';
import { wedo2TiltSensorDirection } from '@/wedo2/devices/tilt';

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

import type { Wedo2LedColor } from '@/wedo2/devices/led';
import type { Wedo2PhysicalPort } from '@/wedo2/devices';
import type { Wedo2TiltSensorDirection } from '@/wedo2/devices/tilt';

export type { Wedo2LedColor, Wedo2PhysicalPort, Wedo2TiltSensorDirection };
