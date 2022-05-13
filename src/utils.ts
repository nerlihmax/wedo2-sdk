import { Either } from 'fp-ts/lib/Either';

export type Values<T> = T[keyof T];
export type ExtractRight<T> = T extends Either<never, infer A> ? A : never;
