/**
 * Create the store with dynamic reducers.
 * (react-router-redux / immutable retained; framework swap is Phase 6.)
 */
import { createStore, applyMiddleware, compose, type Store } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import type { InjectableStore } from './utils/checkStore';

const sagaMiddleware = createSagaMiddleware();

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export default function configureStore(initialState = {}, history: unknown): Store & InjectableStore {
  const middlewares = [sagaMiddleware, routerMiddleware(history as never)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise Redux compose
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Prevent recomputing reducers for `replaceReducer`
          shouldHotReload: false,
        } as never)
      : compose;

  const store = createStore(
    createReducer(),
    fromJS(initialState) as never,
    composeEnhancers(...enhancers) as never,
  ) as Store & InjectableStore;

  // Extensions
  store.runSaga = sagaMiddleware.run as never;
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
}
