/**
 * Test checkStore shape validation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import checkStore, { type InjectableStore } from '../../app/utils/checkStore';

describe('checkStore', () => {
  let store: InjectableStore;

  beforeEach(() => {
    store = {
      dispatch: () => ({}),
      subscribe: () => () => {},
      getState: () => ({}),
      replaceReducer: () => {},
      runSaga: () => {},
      injectedReducers: {},
      injectedSagas: {},
    } as unknown as InjectableStore;
  });

  it('should not throw if passed valid store shape', () => {
    expect(() => checkStore(store)).not.toThrow();
  });

  it('should throw if passed invalid store shape', () => {
    expect(() => checkStore({} as unknown as InjectableStore)).toThrow();
    expect(() =>
      checkStore({ ...store, injectedSagas: null } as unknown as InjectableStore),
    ).toThrow();
    expect(() =>
      checkStore({ ...store, injectedReducers: null } as unknown as InjectableStore),
    ).toThrow();
    expect(() =>
      checkStore({ ...store, runSaga: null } as unknown as InjectableStore),
    ).toThrow();
    expect(() =>
      checkStore({ ...store, replaceReducer: null } as unknown as InjectableStore),
    ).toThrow();
  });
});
