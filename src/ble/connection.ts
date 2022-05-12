import noble from '@abandonware/noble';

import { UUID } from './gatt';

export type Connection<Profile> =
  | ConnectionConnected<Profile>
  | ConnectionDisconnected<Profile>;

export type ConnectionConnected<Profile> = {
  state: 'connected';
  peripheral: noble.Peripheral;
  characteristics: noble.Characteristic[];
  gatt: Profile;
};

export type ConnectionDisconnected<Profile> = {
  state: 'disconnected';
};

export type Connect<Profile> = () => Promise<ConnectionConnected<Profile>>;

export type SetupNotifications<Profile> = (
  connection: ConnectionConnected<Profile>
) => Promise<ConnectionConnected<Profile>>;

export type AddNotifyListener<Profile> = (
  characteristic: UUID,
  listener: () => void
) => (connection: ConnectionConnected<Profile>) => ConnectionConnected<Profile>;
