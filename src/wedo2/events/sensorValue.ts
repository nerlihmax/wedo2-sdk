import { Either, right } from 'fp-ts/lib/Either';

export type Wedo2EventSensorValue = { a: 1 };

export const parseSensorValue = (
  data: Buffer
): Either<Error, Wedo2EventSensorValue> => {
  const value = [...data];

  return right({ a: 1 });
};
