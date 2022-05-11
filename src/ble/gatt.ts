import { string } from 'fp-ts';

export type UUID = string;

type GattService<Chars extends string> = {
  uuid: UUID;
  characteristics: Record<Chars, UUID>;
};

export type GattProfile<
  Services extends Record<keyof Services, Services[keyof Services]>
> = Record<keyof Services, GattService<Services[keyof Services]>>;
