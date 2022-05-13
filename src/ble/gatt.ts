import { Device } from './device';

export type UUID = string;

// type GattService<Chars extends string> = {
//   uuid: UUID;
//   characteristics: Record<Chars, UUID>;
// };

// export type GattProfile<
//   Profile extends Record<keyof Profile, Profile[keyof Profile]>
// > = {
//   [Service in keyof Profile]: GattService<Profile[Service]>;
// };

export type GattProfile<
  Services extends Record<keyof Services, Services[keyof Services]>
> = {
  type: Device;
  services: Services;
};
