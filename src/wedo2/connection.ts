import * as R from 'ramda';
import noble from '@abandonware/noble';

import {
  Connect,
  SetupNotifications,
  AddNotifyListener,
} from '../ble/connection';
import { UUID } from '../ble/gatt';
import { addNotificationCallback, subscribe } from '../ble/characteristic';
import { Wedo2GattProfile, profile } from './gatt';

type NotificableCharacteristic =
  Wedo2GattProfile['services']['commonService']['characteristics']; // Закончил тут

const isWedo2 = (identity: UUID) => (ad: noble.Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(R.equals(identity)) !== -1;

export const connect: Connect<Wedo2GattProfile> = async () => {
  await noble.startScanningAsync();

  return new Promise((resolve) => {
    noble.on('discover', async (peripheral) => {
      const { advertisement } = peripheral;
      const { localName } = advertisement;

      if (isWedo2(profile.services.commonService.uuid)(advertisement)) {
        console.info(`found wedo2 device ${localName}`);
        await peripheral.connectAsync();
        await peripheral.discoverAllServicesAndCharacteristicsAsync();

        const characteristics = peripheral.services.reduce<
          noble.Characteristic[]
        >((acc, curr) => [...acc, ...curr.characteristics], []);

        resolve({
          state: 'connected',
          gatt: profile,
          peripheral,
          characteristics,
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
    connection.gatt.commonService.characteristics.attachedIo
  );

  return connection;
};

export const addNotificationListener: AddNotifyListener<Wedo2GattProfile> =
  (characteristic, listener) => (connection) => {
    addNotificationCallback(connection, characteristic, (data) => {
      console.log(data);
      listener();
    });
    return connection;
  };
