import {
  connect,
  setAttachIoListener,
  setSensorValueListener,
} from '../src/connection';
import { setLedColor } from './wedo2/cmds/led';
import { setMotorState } from './wedo2/cmds/motor';
import { Wedo2PhysicalPort } from './wedo2/devices';
import { wedo2PhysicalPort } from './wedo2/devices';
import { Wedo2LedColor } from './wedo2/devices/led';
import { wedo2LedColor } from './wedo2/devices/led';
import { Wedo2TiltSensorDirection } from './wedo2/devices/tilt';
import { wedo2TiltSensorDirection } from './wedo2/devices/tilt';

export {
  connect,
  setAttachIoListener,
  setSensorValueListener,
  setLedColor,
  setMotorState,
  Wedo2PhysicalPort,
  wedo2PhysicalPort,
  Wedo2LedColor,
  wedo2LedColor,
  Wedo2TiltSensorDirection,
  wedo2TiltSensorDirection,
};
