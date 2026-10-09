import React, { useEffect, useRef } from 'react';
import { useStore } from 'react-redux';

import getInjectors from './sagaInjectors';
import type { InjectableStore } from './checkStore';

interface InjectSagaArgs {
  key: string;
  saga: (...args: unknown[]) => unknown;
  mode?: string;
}

/**
 * Dynamically injects a saga, passing the component's props as saga arguments.
 *
 * Phase 6: rewritten from a legacy-context class HOC (React 15 contextTypes)
 * to a hooks HOC using react-redux's useStore. Behavior preserved: the saga
 * is injected on mount and ejected on unmount (RESTART_ON_REMOUNT default;
 * DAEMON / ONCE_TILL_UNMOUNT modes handled by the injector).
 */
export default ({ key, saga, mode }: InjectSagaArgs) =>
  function WithSaga<P extends object>(WrappedComponent: React.ComponentType<P>) {
    const InjectSaga = (props: P): React.ReactElement => {
      // SAFETY: react-redux's typed Store lacks the injector fields
      // (runSaga/injectedReducers/injectedSagas) the legacy injectors attach
      // at runtime; InjectableStore is the real shape. Double assertion bridges
      // until Phase 6 RTK rewrite types the store.
      const store = useStore() as unknown as InjectableStore;
      // SAFETY: injectors are a stateless factory over the store; capturing
      // them once per mount matches the original field-initializer behavior.
      const injectorsRef = useRef(getInjectors(store));
      injectorsRef.current = getInjectors(store);

      useEffect(() => {
        injectorsRef.current.injectSaga(key, { saga, mode }, props);
        return () => {
          injectorsRef.current.ejectSaga(key);
        };
        // key/saga/mode are static per call site; props mirror the original
        // (they were read once at mount in componentWillMount).
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [key]);

      return <WrappedComponent {...props} />;
    };
    InjectSaga.displayName = `withSaga(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    InjectSaga.WrappedComponent = WrappedComponent;
    return InjectSaga;
  };
