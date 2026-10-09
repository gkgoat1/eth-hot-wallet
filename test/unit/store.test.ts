/**
 * Test store addons (Phase 6: RTK configureStore, no history param,
 * no __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ — RTK wires DevTools itself).
 */

import { describe, it, expect, beforeAll } from 'vitest';
import configureStore from '../../app/store';

describe('configureStore', () => {
  // SAFETY: configureStore returns AppStore (Store & InjectableStore); the
  // injector fields are attached at runtime in app/store.ts.
  let store: ReturnType<typeof configureStore>;

  beforeAll(() => {
    store = configureStore({});
  });

  describe('injectedReducers', () => {
    it('should contain an object for reducers', () => {
      expect(typeof store.injectedReducers).toBe('object');
    });
  });

  describe('injectedSagas', () => {
    it('should contain an object for sagas', () => {
      expect(typeof store.injectedSagas).toBe('object');
    });
  });

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function');
    });
  });
});
