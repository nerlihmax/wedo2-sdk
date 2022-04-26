import * as R from 'ramda';
import noble from '@abandonware/noble';

import { WedoConnectionConnected } from './connection';
import { UUID } from './gatt';

const findCharacteristic = (
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
    throw new Error(`куда-то пропал gatt-характеристика ${characteristicUuid}`);
  }

  return characteristic;
};

// TODO: generics
type Notify = (
  connection: WedoConnectionConnected,
  service: UUID,
  characteristic: UUID
) => Promise<void>;

export const notify: Notify = async (
  connection,
  serviceUuid,
  characteristicUuid
) => {
  console.log(
    findCharacteristic(connection._peripheral, serviceUuid, characteristicUuid)
  );
};
