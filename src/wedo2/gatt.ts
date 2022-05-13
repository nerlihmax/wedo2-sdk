import { GattProfile } from '../ble/gatt';

// export type Wedo2GattProfile = GattProfile<{
//   ioService: 'sensorValue' | 'valueFormat' | 'inputCommand' | 'outputCommand';
//   commonService:
//     | 'name'
//     | 'button'
//     | 'attachedIo'
//     | 'lowVoltage'
//     | 'highCurrent'
//     | 'lowSignal'
//     | 'turnOff'
//     | 'vccPort'
//     | 'batteryType'
//     | 'disconnect';
//   batteryService: 'batteryLevel';
// }>;

export type Wedo2GattProfile = GattProfile<{
  ioService: {
    uuid: '00004f0e1212efde1523785feabcd123';
    characteristics: {
      sensorValue: '000015601212efde1523785feabcd123';
      valueFormat: '000015611212efde1523785feabcd123';
      inputCommand: '000015631212efde1523785feabcd123';
      outputCommand: '000015651212efde1523785feabcd123';
    };
  };
  commonService: {
    uuid: '000015231212efde1523785feabcd123';
    characteristics: {
      name: '000015241212efde1523785feabcd123';
      button: '000015261212efde1523785feabcd123';
      attachedIo: '000015271212efde1523785feabcd123'; // aka scratch's attached_io
      lowVoltage: '000015281212efde1523785feabcd123';
      highCurrent: '000015291212efde1523785feabcd123';
      lowSignal: '0000152a1212efde1523785feabcd123';
      turnOff: '0000152b1212efde1523785feabcd123';
      vccPort: '0000152c1212efde1523785feabcd123';
      batteryType: '0000152d1212efde1523785feabcd123';
      disconnect: '0000152e1212efde1523785feabcd123';
    };
  };
  batteryService: {
    uuid: '0000180f1212efde1523785feabcd123';
    characteristics: {
      batteryLevel: '00002a191212efde1523785feabcd123';
    };
  };
}>;

export const profile: Wedo2GattProfile = {
  type: 'wedo2',
  services: {
    ioService: {
      uuid: '00004f0e1212efde1523785feabcd123',
      characteristics: {
        sensorValue: '000015601212efde1523785feabcd123',
        valueFormat: '000015611212efde1523785feabcd123',
        inputCommand: '000015631212efde1523785feabcd123',
        outputCommand: '000015651212efde1523785feabcd123',
      },
    },
    commonService: {
      uuid: '000015231212efde1523785feabcd123',
      characteristics: {
        name: '000015241212efde1523785feabcd123',
        button: '000015261212efde1523785feabcd123',
        attachedIo: '000015271212efde1523785feabcd123', // aka scratch's attached_io
        lowVoltage: '000015281212efde1523785feabcd123',
        highCurrent: '000015291212efde1523785feabcd123',
        lowSignal: '0000152a1212efde1523785feabcd123',
        turnOff: '0000152b1212efde1523785feabcd123',
        vccPort: '0000152c1212efde1523785feabcd123',
        batteryType: '0000152d1212efde1523785feabcd123',
        disconnect: '0000152e1212efde1523785feabcd123',
      },
    },
    batteryService: {
      uuid: '0000180f1212efde1523785feabcd123',
      characteristics: {
        batteryLevel: '00002a191212efde1523785feabcd123',
      },
    },
  },
};
