import * as R from 'ramda';
import noble from '@abandonware/noble';

import type { ConnectionConnected } from './connection';
import type { GattProfile, UUID } from 'src/ble/gatt';

export const findCharacteristic = (
  peripheral: noble.Peripheral,
  serviceUuid: UUID,
  characteristicUuid: UUID
): noble.Characteristic => {
  const findByUuid = R.propEq('uuid');

  const service = peripheral.services.find(findByUuid(serviceUuid));
  if (!service) {
    throw new Error(`куда-то пропал gatt-сервис ${serviceUuid}`);
  }

  const characteristic = service.characteristics.find(
    findByUuid(characteristicUuid)
  );
  if (!characteristic) {
    throw new Error(
      `куда-то пропала gatt-характеристика ${characteristicUuid}`
    );
  }

  return characteristic;
};

type Subscribe<Profile extends GattProfile> = (
  connection: ConnectionConnected<Profile>,
  service: UUID,
  characteristic: UUID
) => Promise<void>;
export const subscribe: Subscribe = (
  connection,
  serviceUuid,
  characteristicUuid
) =>
  findCharacteristic(
    connection.peripheral,
    serviceUuid,
    characteristicUuid
  ).subscribeAsync();

type SetNotificationCallback<
  Profile extends GattProfile,
  Callback extends () => void
> = (
  connection: ConnectionConnected<Profile>,
  service: UUID,
  characterictic: UUID,
  callback: Callback
) => void;
export const addNotificationCallback: SetNotificationCallback = (
  connection,
  service,
  characterictic,
  callback
) =>
  findCharacteristic(connection.peripheral, service, characterictic).on(
    'notify',
    callback
  );
