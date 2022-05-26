import { propEq, equals } from 'ramda';

import type {
  Advertisement,
  Characteristic,
  Peripheral,
} from '@abandonware/noble';
import type { UUID } from '@wedo2-sdk/shared';

export const isWedo2 = (identity: UUID) => (ad: Advertisement) =>
  ad.serviceUuids && ad.serviceUuids.findIndex(equals(identity)) !== -1;

export const findByUuid = (uuid: UUID) => propEq('uuid', uuid);

export const findCharacteristic = (
  peripheral: Peripheral,
  char: UUID
): Characteristic => {
  const service = peripheral.services.find((service) =>
    service.characteristics.find(findByUuid(char))
  );

  const characteristic = service?.characteristics.find(findByUuid(char));

  if (!characteristic) {
    throw new Error(`куда-то пропала gatt-характеристика ${char}`);
  }

  return characteristic;
};
