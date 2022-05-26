import { pipe, equals } from 'ramda';
import { profile } from '@wedo2-sdk/shared';

import type { UUID } from '@wedo2-sdk/shared';

export const insert = (ins: string, idx: number) => (orig: string) =>
  orig.slice(0, idx) + ins + orig.slice(idx);

export const formatUuid = pipe(
  insert('-', 8),
  insert('-', 13),
  insert('-', 18),
  insert('-', 23)
);

export const useCounter = () => {
  let count = 0;
  return () => (count += 1);
};

export const findService = (char: UUID) => {
  const service = Object.values(profile.services).find((service) =>
    Object.values(service.characteristics).find(equals(char))
  );

  if (!service) {
    throw new Error(`куда-то пропал gatt-сервис c характеристикой ${char}`);
  }

  return service;
};
