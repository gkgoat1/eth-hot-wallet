import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getInjectors from './sagaInjectors';

// SAFETY: hoist-non-react-statics@2's bundled d.ts resolves `react` through
// pnpm's fallback store (@types/react@19) while the app compiles against
// @types/react@15, so its React.ComponentType is structurally incompatible
// with this app's component classes. At runtime it only copies statics onto
// the target component; this binding re-types it against the app's React 15
// types so both arguments check locally.
const hoistStatics = hoistNonReactStatics as unknown as (
  target: React.ComponentType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  source: React.ComponentType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
) => React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

interface InjectSagaArgs {
  key: string;
  saga: (...args: unknown[]) => unknown;
  mode?: string;
}

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.RESTART_ON_REMOUNT) the saga will be started on component mount and
 * cancelled with `task.cancel()` on component un-mount for improved performance. Another two options:
 *   - constants.DAEMON—starts the saga on component mount and never cancels it or starts again,
 *   - constants.ONCE_TILL_UNMOUNT—behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default ({ key, saga, mode }: InjectSagaArgs) => (WrappedComponent: React.ComponentType<any>) => {
  class InjectSaga extends React.Component<any> {
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };
    static displayName = `withSaga(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;

    // SAFETY: legacy contextTypes above guarantee `store` is present on
    // context. `declare` keeps the class from emitting a field that would
    // clobber React's context assignment (ES2022 define-field semantics);
    // React assigns context in the base constructor, before `injectors`
    // is first read on mount/unmount.
    declare context: { store: Parameters<typeof getInjectors>[0] };

    componentWillMount() {
      const { injectSaga } = this.injectors;

      injectSaga(key, { saga, mode }, this.props);
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors;

      ejectSaga(key);
    }

    // getInjectors is a stateless factory over the store (validated per
    // call), so reading it via a getter is behaviorally identical to the
    // original field initializer while keeping `declare context` above.
    get injectors() {
      return getInjectors(this.context.store);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistStatics(InjectSaga, WrappedComponent);
};
