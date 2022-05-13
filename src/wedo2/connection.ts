import * as R from 'ramda';
import * as E from 'fp-ts/Either';
import noble from '@abandonware/noble';

import {
  Connect,
  SetupNotifications,
  AddNotifyListener,
} from '../ble/connection';
import { UUID } from '../ble/gatt';
import { addNotificationCallback, subscribe } from '../ble/characteristic';
import { Wedo2GattProfile, profile } from './gatt';
import { parseAttachedIo } from './events/attachedIo';
import { parseSensorValue } from './events/sensorValue';

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
          _gatt: profile,
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
  await Promise.all(
    [
      profile.services.commonService.characteristics.attachedIo,
      profile.services.ioService.characteristics.sensorValue,
    ].map(() =>
      subscribe(
        connection,
        profile.services.commonService.characteristics.attachedIo
      )
    )
  );

  return connection;
};

const matchParser = {
  [profile.services.ioService.characteristics.sensorValue]: parseSensorValue,
  [profile.services.commonService.characteristics.attachedIo]: parseAttachedIo,
} as const;

export const addNotificationListener: AddNotifyListener<
  Wedo2GattProfile,
  typeof matchParser
> = (characteristic, listener) => (connection) => {
  addNotificationCallback(connection, characteristic, (data) => {
    console.info('core: received notification with payload: ', data);
    const parser = matchParser[characteristic];
    const parsed = parser(data);
    if (E.isLeft(parsed)) return;

    if (parsed) listener(parsed.right);
  });
  return connection;
};
