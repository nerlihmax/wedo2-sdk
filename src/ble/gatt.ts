import { Device } from './device';

export type UUID = string;

type GattService<Chars extends string> = {
  uuid: UUID;
  characteristics: Record<Chars, UUID>;
};

// export type GattProfile<
//   Profile extends Record<keyof Profile, Profile[keyof Profile]>
// > = {
//   [Service in keyof Profile]: GattService<Profile[Service]>;
// };

export type GattProfile<
  Profile extends Record<keyof Profile, Profile[keyof Profile]>
> = {
  type: Device;
  services: {
    [Service in keyof Profile]: GattService<Profile[Service]>;
  };
};
