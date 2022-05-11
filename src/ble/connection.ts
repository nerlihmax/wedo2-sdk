import noble from '@abandonware/noble';

import { GattProfile, UUID } from './gatt';

export type Connection<Profile extends GattProfile> =
  | ConnectionConnected<Profile>
  | ConnectionDisconnected;

export type ConnectionConnected<Profile> = {
  state: 'connected';
  peripheral: noble.Peripheral;
  gatt: Profile;
};

export type ConnectionDisconnected = {
  state: 'disconnected';
};

export type Connect<Profile> = () => Promise<ConnectionConnected<Profile>>;

export type SetupNotifications<Profile> = (
  connection: ConnectionConnected<Profile>
) => Promise<ConnectionConnected<Profile>>;

export type AddNotifyListener<Profile> = (
  service: UUID,
  characterictic: UUID,
  listener: () => void
) => (connection: ConnectionConnected<Profile>) => ConnectionConnected<Profile>;
