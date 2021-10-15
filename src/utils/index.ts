import type { Router } from 'express';

export const contentTypeHeaders = { headers: { 'Content-Type': 'application/json' } };

export const errMsgs = { noValue: 'no value' };

type Wrapper = (router: Router) => void;

export const applyMiddleware = (middlewareWrappers: Wrapper[], router: Router): void => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

export function assertNever(x: never): never {
  throw new Error('this should never happen' + x);
}

export type Nullable<T> = T | null;
