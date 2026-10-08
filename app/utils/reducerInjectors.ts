import invariant from 'invariant';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

import checkStore, { type InjectableStore } from './checkStore';
import createReducer from '../reducers';

type Reducer = (state: unknown, action: unknown) => unknown;

export function injectReducerFactory(store: InjectableStore, isValid: boolean) {
  return function injectReducer(key: string, reducer: Reducer): void {
    if (!isValid) checkStore(store);

    invariant(
      isString(key) && !isEmpty(key) && isFunction(reducer),
      '(app/utils...) injectReducer: Expected `reducer` to be a reducer function',
    );

    // Hot reloading: same key but different reducer -> replace.
    if (Reflect.has(store.injectedReducers, key) && store.injectedReducers[key] === reducer) return;

    store.injectedReducers[key] = reducer;
    (store.replaceReducer as (r: Reducer) => void)(createReducer(store.injectedReducers as never));
  };
}

export default function getInjectors(store: InjectableStore): {
  injectReducer: (key: string, reducer: Reducer) => void;
} {
  checkStore(store);

  return {
    injectReducer: injectReducerFactory(store, true),
  };
}
