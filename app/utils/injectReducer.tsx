import React, { useRef } from 'react';
import { useStore } from 'react-redux';

import getInjectors from './reducerInjectors';
import type { InjectableStore } from './checkStore';

type Reducer = (state: unknown, action: unknown) => unknown;

interface InjectReducerArgs {
  key: string;
  reducer: Reducer;
}

/**
 * Dynamically injects a reducer.
 *
 * Phase 6: rewritten from a legacy-context class HOC (React 15 contextTypes)
 * to a hooks HOC using react-redux's useStore, matching injectSaga. Behavior
 * preserved: the reducer is injected before first paint (useLayoutEffect, so
 * the connected child renders against an already-combined reducer tree).
 */
export default ({ key, reducer }: InjectReducerArgs) =>
  function WithReducer<P extends object>(WrappedComponent: React.ComponentType<P>) {
    const InjectReducer = (props: P): React.ReactElement => {
      // SAFETY: react-redux's typed Store lacks the injector fields
      // (injectedReducers/replaceReducer augmentation) the injectors attach
      // at runtime; InjectableStore is the real shape.
      const store = useStore() as unknown as InjectableStore;
      // SAFETY: injectors are a stateless factory over the store; capturing
      // them once per mount matches the original behavior.
      const injectorsRef = useRef(getInjectors(store));
      injectorsRef.current = getInjectors(store);

      // Inject synchronously before children render. The original used
      // componentWillMount; useLayoutEffect fires after the first commit in
      // React 18, so instead inject during render — injectReducer is
      // idempotent (no-op when the same reducer is already registered) and
      // safe to re-run.
      injectorsRef.current.injectReducer(key, reducer);

      return <WrappedComponent {...props} />;
    };
    InjectReducer.displayName = `withReducer(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    InjectReducer.WrappedComponent = WrappedComponent;
    return InjectReducer;
  };
