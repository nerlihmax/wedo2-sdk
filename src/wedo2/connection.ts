import * as R from 'ramda';
import noble from '@abandonware/noble';

import {
  Connect,
  SetupNotifications,
  AddNotifyListener,
} from 'src/ble/connection';
import { UUID } from 'src/ble/gatt';
import { addNotificationCallback, subscribe } from 'src/ble/characterictic';
import { Wedo2GattProfile, wedo2gattProfile } from 'src/wedo2/gatt';

export type Wedo2ConnectionError = {
  reason: 'connection';
};

const isWedo2 = (identity: UUID) => (ad: noble.Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(R.equals(identity)) !== -1;

export const connect: Connect<Wedo2GattProfile> = async () => {
  await noble.startScanningAsync();

  return new Promise((resolve) => {
    noble.on('discover', async (peripheral) => {
      const { advertisement } = peripheral;
      const { localName } = advertisement;

      if (isWedo2(wedo2gattProfile.commonService.uuid)(advertisement)) {
        console.info(`found wedo2 device ${localName}`);
        await peripheral.connectAsync();
        await peripheral.discoverAllServicesAndCharacteristicsAsync();

        resolve({
          state: 'connected',
          gatt: wedo2gattProfile,
          peripheral: peripheral,
        });
      }
    });
  });
};

export const setupNotifications: SetupNotifications<Wedo2GattProfile> = async (
  connection
) => {
  await subscribe(
    connection,
    connection.gatt.commonService.uuid,
    connection.gatt.commonService.characteristics.attachedIo
  );

  return connection;
};

export const addNotifyListener: AddNotifyListener<Wedo2GattProfile> =
  (service, characterictic, listener) => (connection) => {
    addNotificationCallback(connection, service, characterictic, listener);
    return connection;
  };
