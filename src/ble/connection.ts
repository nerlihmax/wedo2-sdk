import noble from '@abandonware/noble';

// warp in either
export type Connection<Profile> =
  | ConnectionConnected<Profile>
  | ConnectionDisconnected<Profile>;

export type ConnectionConnected<Profile> = {
  state: 'connected';
  peripheral: noble.Peripheral;
  characteristics: noble.Characteristic[];
  _gatt: Profile;
};

export type ConnectionDisconnected<Profile> = {
  state: 'disconnected';
};

export type Connect<Profile> = () => Promise<ConnectionConnected<Profile>>;

export type SetupNotifications<Profile> = (
  connection: ConnectionConnected<Profile>
) => Promise<ConnectionConnected<Profile>>;

export type AddNotifyListener<
  Profile,
  Notificable extends {
    readonly [P in keyof Notificable]: Notificable[P];
  }
> = (
  characteristic: keyof Notificable,
  // TODO: infer type from я хз ваще как тут довести тип
  listener: <T>(event: T) => void
) => (connection: ConnectionConnected<Profile>) => ConnectionConnected<Profile>;

export type SendInputCommand<Profile> = () => Promise<
  ConnectionConnected<Profile>
>;
