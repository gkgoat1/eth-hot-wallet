/**
 * Test reducer injectors (Phase 6: plain-JS state, no history param).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import identity from 'lodash/identity';

import configureStore from '../../app/store';
import getInjectors, {
  injectReducerFactory,
} from '../../app/utils/reducerInjectors';
import type { InjectableStore } from '../../app/utils/checkStore';

// Fixtures
const initialState = { reduced: 'soon' };

// Matches the injector's loose Reducer = (state: unknown, action: unknown) => unknown.
type Reducer = (state: unknown, action: unknown) => unknown;

const reducer: Reducer = (state, action) => {
  const s = (state as typeof initialState) ?? initialState;
  const a = action as { type: string; payload?: unknown };
  switch (a.type) {
    case 'TEST':
      return { ...s, reduced: a.payload };
    default:
      return s;
  }
};

describe('reducer injectors', () => {
  let store: InjectableStore;
  let injectReducer: ReturnType<typeof injectReducerFactory>;

  describe('getInjectors', () => {
    beforeEach(() => {
      store = configureStore({});
    });

    it('should return injectors', () => {
      expect(getInjectors(store)).toEqual(
        expect.objectContaining({
          injectReducer: expect.any(Function),
        }),
      );
    });

    it('should throw if passed invalid store shape', () => {
      Reflect.deleteProperty(store, 'dispatch');
      expect(() => getInjectors(store)).toThrow();
    });
  });

  describe('injectReducer helper', () => {
    beforeEach(() => {
      store = configureStore({});
      injectReducer = injectReducerFactory(store, true);
    });

    it('should check a store if the second argument is falsy', () => {
      const inject = injectReducerFactory({} as InjectableStore, false);
      expect(() => inject('test', reducer)).toThrow();
    });

    it('should not check a store if the second argument is true', () => {
      Reflect.deleteProperty(store, 'dispatch');
      expect(() => injectReducer('test', reducer)).not.toThrow();
    });

    it("should validate a reducer and reducer's key", () => {
      expect(() => injectReducer('', reducer)).toThrow();
      expect(() => injectReducer(1 as unknown as string, reducer)).toThrow();
      expect(() => injectReducer(1 as unknown as string, 1 as unknown as Reducer)).toThrow();
    });

    it('given a store, it should provide a function to inject a reducer', () => {
      injectReducer('test', reducer);
      // SAFETY: InjectableStore.getState is typed unknown (injector store shape
      // predates RTK typing); the injected 'test' reducer sets this key.
      const getState = store.getState as () => Record<string, unknown>;
      expect(getState().test).toEqual(initialState);
    });

    it('should not assign reducer if already existing', () => {
      store.replaceReducer = vi.fn();
      injectReducer('test', reducer);
      injectReducer('test', reducer);
      expect(store.replaceReducer).toHaveBeenCalledTimes(1);
    });

    it('should assign reducer if different implementation for hot reloading', () => {
      store.replaceReducer = vi.fn();
      injectReducer('test', reducer);
      injectReducer('test', identity as unknown as Reducer);
      expect(store.replaceReducer).toHaveBeenCalledTimes(2);
    });
  });
});
