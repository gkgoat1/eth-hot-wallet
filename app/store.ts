/**
 * Create the store with dynamic reducers.
 * (react-router-redux / immutable retained; framework swap is Phase 6.)
 */
import { createStore, applyMiddleware, compose, type Store, type Middleware } from 'redux';
import { fromJS } from 'immutable';
// SAFETY: react-router-redux@5.0.0-alpha.9 bundles no type declarations, so
// TS7016 is suppressed on the import; routerMiddleware is re-typed at the
// explicit binding below.
// @ts-expect-error TS7016: react-router-redux ships no type declarations
import { routerMiddleware as routerMiddlewareUntyped } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import type { InjectableStore } from './utils/checkStore';

const sagaMiddleware = createSagaMiddleware();

// Explicitly typed binding over the untyped module import above.
const routerMiddleware: (history: unknown) => Middleware = routerMiddlewareUntyped;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export default function configureStore(
  initialState = {},
  history: unknown,
): Store<unknown> & InjectableStore {
  const middlewares = [sagaMiddleware, routerMiddleware(history)];

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
  // SAFETY: createStore's typed Store lacks the injector fields (runSaga,
  // injectedReducers, injectedSagas) that the legacy injectors attach at
  // runtime; the app relies on them being present. The double assertion is
  // the minimal bridge until the Phase 6 redux-toolkit rewrite types the
  // store properly.
  ) as unknown as Store<unknown> & InjectableStore;

  // Extensions
  store.runSaga = sagaMiddleware.run as never;
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
}
