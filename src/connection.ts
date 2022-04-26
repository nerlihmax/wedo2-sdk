import noble from '@abandonware/noble';

import { GattProfile, profile } from './gatt';

export type WedoConnection =
  | WedoConnectionConnected
  | WedoConnectionDisconnected;

export type WedoConnectionConnected = {
  state: 'connected';
  _peripheral: noble.Peripheral;
  gatt: GattProfile;
};

export type WedoConnectionDisconnected = {
  state: 'disconnected';
};

export type WedoConnectionError = {
  reason: 'connection';
};

type Connect = () => Promise<WedoConnectionConnected>;

export const connect: Connect = async () => {
  await noble.startScanningAsync();

  return new Promise((resolve) => {
    noble.on('discover', async (peripheral) => {
      const { advertisement } = peripheral;
      const { localName } = advertisement;

      const isWedo = (ad: noble.Advertisement) =>
        ad.serviceUuids &&
        ad.serviceUuids.findIndex((s) => s === profile.commonService.uuid) !==
          -1;

      if (isWedo(advertisement)) {
        console.info(`found wedo-like device ${localName}`);
        await peripheral.connectAsync();
        await peripheral.discoverAllServicesAndCharacteristicsAsync();

        resolve({ state: 'connected', gatt: profile, _peripheral: peripheral });
      }
    });
  });
};
