export type UUID = string;

type CommonServiceCharacteristics =
  | 'button'
  | 'portType'
  | 'lowVoltage'
  | 'highCurrent'
  | 'lowSignal'
  | 'turnOff'
  | 'vccPort'
  | 'batteryType'
  | 'disconnect';

type IOServiceCharacteristics =
  | 'sensorValue'
  | 'valueFormat'
  | 'inputCommand'
  | 'outputCommand';

type GattCharacteristic = UUID;

type GattService<C extends string> = {
  uuid: string;
  characteristics: Record<C, GattCharacteristic>;
};

export type GattProfile = {
  commonService: GattService<CommonServiceCharacteristics>;
  ioService: GattService<IOServiceCharacteristics>;
};

export const profile: GattProfile = {
  ioService: {
    uuid: '00004f0e1212efde1523785feabcd123',
    characteristics: {
      sensorValue: '000015601212efde1523785feabcd123',
      valueFormat: '000015611212efde1523785feabcd123',
      inputCommand: '000015601212efde1523785feabcd123',
      outputCommand: '000015601212efde1523785feabcd123',
    },
  },
  commonService: {
    uuid: '000015231212efde1523785feabcd123',
    characteristics: {
      button: '000015261212efde1523785feabcd123',
      portType: '000015271212efde1523785feabcd123',
      lowVoltage: '000015281212efde1523785feabcd123',
      highCurrent: '000015291212efde1523785feabcd123',
      lowSignal: '0000152a1212efde1523785feabcd123',
      turnOff: '0000152b1212efde1523785feabcd123',
      vccPort: '0000152c1212efde1523785feabcd123',
      batteryType: '0000152d1212efde1523785feabcd123',
      disconnect: '0000152e1212efde1523785feabcd123',
    },
  },
};
