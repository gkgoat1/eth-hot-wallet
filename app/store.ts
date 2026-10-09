/**
 * Create the store with dynamic reducers.
 *
 * Phase 6: React Router v6 owns routing/history, so react-router-redux and its
 * routerMiddleware are removed. Redux Toolkit's configureStore replaces the
 * redux@3 createStore + compose plumbing. Immutable/redux-immutable state is
 * removed: the store holds plain JS objects.
 */
import { configureStore, type Store } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import type { InjectableStore } from './utils/checkStore';

const sagaMiddleware = createSagaMiddleware();

export type AppStore = Store & InjectableStore;

export default function configureAppStore(initialState = {}): AppStore {
  const store = configureStore({
    reducer: createReducer() as never,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // The app stores non-serializable values (keystore instances,
        // BigNumber), so RTK's default dev checks don't apply.
        serializableCheck: false,
        immutableCheck: false,
      }).concat(sagaMiddleware),
  });

  // Extensions (reducer/saga injectors). SAFETY: configureStore returns a full
  // redux Store (with Symbol.observable); the injector fields are attached
  // below at runtime, so the combined type is the real shape.
  const injectable = store as Store as AppStore;
  injectable.runSaga = sagaMiddleware.run as never;
  injectable.injectedReducers = {};
  injectable.injectedSagas = {};

  return injectable;
}
