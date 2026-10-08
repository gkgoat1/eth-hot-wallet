import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import invariant from 'invariant';
import conformsTo from 'lodash/conformsTo';

import checkStore, { type InjectableStore } from './checkStore';
import { DAEMON, ONCE_TILL_UNMOUNT, RESTART_ON_REMOUNT } from './constants';

const allowedModes = [RESTART_ON_REMOUNT, DAEMON, ONCE_TILL_UNMOUNT];

type Saga = (...args: unknown[]) => unknown;

interface SagaDescriptor {
  saga: Saga;
  mode?: string;
  task?: { cancel: () => void };
}

const checkKey = (key: string): void =>
  invariant(
    isString(key) && !isEmpty(key),
    '(app/utils...) injectSaga: Expected `key` to be a non empty string',
  );

const checkDescriptor = (descriptor: SagaDescriptor): void => {
  const shape = {
    saga: isFunction,
    mode: (mode: unknown) => isString(mode) && allowedModes.includes(mode as string),
  };
  invariant(
    conformsTo(descriptor, shape),
    '(app/utils...) injectSaga: Expected a valid saga descriptor',
  );
};

export function injectSagaFactory(store: InjectableStore, isValid: boolean) {
  return function injectSaga(key: string, descriptor: SagaDescriptor = {} as SagaDescriptor, args?: unknown): void {
    if (!isValid) checkStore(store);

    const newDescriptor = { ...descriptor, mode: descriptor.mode || RESTART_ON_REMOUNT };
    const { saga, mode } = newDescriptor;

    checkKey(key);
    checkDescriptor(newDescriptor);

    let hasSaga = Reflect.has(store.injectedSagas, key);

    if (process.env.NODE_ENV !== 'production') {
      const oldDescriptor = store.injectedSagas[key] as SagaDescriptor | undefined;
      if (hasSaga && oldDescriptor && oldDescriptor.saga !== saga) {
        oldDescriptor.task!.cancel();
        hasSaga = false;
      }
    }

    if (!hasSaga || (hasSaga && mode !== DAEMON && mode !== ONCE_TILL_UNMOUNT)) {
      store.injectedSagas[key] = {
        ...newDescriptor,
        task: (store.runSaga as (s: Saga, a?: unknown) => { cancel: () => void })(saga, args),
      };
    }
  };
}

export function ejectSagaFactory(store: InjectableStore, isValid: boolean) {
  return function ejectSaga(key: string): void {
    if (!isValid) checkStore(store);

    checkKey(key);

    if (Reflect.has(store.injectedSagas, key)) {
      const descriptor = store.injectedSagas[key] as SagaDescriptor;
      if (descriptor.mode !== DAEMON) {
        descriptor.task!.cancel();
        if (process.env.NODE_ENV === 'production') {
          // value marker so ONCE_TILL_UNMOUNT sagas are detectable in injectSaga
          (store.injectedSagas as Record<string, unknown>)[key] = 'done';
        }
      }
    }
  };
}

export default function getInjectors(store: InjectableStore): {
  injectSaga: (key: string, descriptor?: SagaDescriptor, args?: unknown) => void;
  ejectSaga: (key: string) => void;
} {
  checkStore(store);

  return {
    injectSaga: injectSagaFactory(store, true),
    ejectSaga: ejectSagaFactory(store, true),
  };
}
