import { Values } from '../../utils';
import { Wedo2BaseDevice } from './index';

export type Wedo2LedColor = Values<typeof wedo2LedColor>;

export const wedo2LedColor = {
  DISABLED: 0,
  PINK: 1,
  PURPLE: 2,
  BLUE: 3,
  LIGHT_BLUE: 4,
  TEAL: 5,
  GREEN: 6,
  YELLOW: 7,
  ORANGE: 8,
  RED: 9,
  WHITE: 10,
} as const;

export type Wedo2Led = Wedo2BaseDevice & {
  _tag: 'led';
  port: 6;
  ioType: 0x17;
};

export const wedo2Led: Wedo2Led = {
  _tag: 'led',
  port: 6,
  ioType: 0x17,
};
