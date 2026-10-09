/**
 * Test the injectReducer HOC (Phase 6: hooks-based, react-test-renderer@18).
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';

import configureStore, { type AppStore } from '../../app/store';
import injectReducer from '../../app/utils/injectReducer';

const Component: React.FC<Record<string, unknown>> = () => null;
// redux 5 combineReducers requires reducers to return their initial state for
// undefined state (identity returns undefined and fails the shape check).
const reducer = (state: unknown = {}): unknown => state;

describe('injectReducer decorator', () => {
  it('should inject a given reducer on mount', () => {
    const store: AppStore = configureStore({});
    const spy = vi.spyOn(store, 'replaceReducer' as never);

    const ComponentWithReducer = injectReducer({ key: 'test', reducer })(Component);
    TestRenderer.act(() => {
      TestRenderer.create(
        <Provider store={store}>
          <ComponentWithReducer />
        </Provider>,
      );
    });

    // The injector calls replaceReducer once when injecting the new key.
    expect(spy).toHaveBeenCalledTimes(1);
    expect(store.injectedReducers.test).toBe(reducer);
  });

  it('should set a correct display name', () => {
    const Wrapped = injectReducer({ key: 'test', reducer })(Component);
    expect(Wrapped.displayName).toBe('withReducer(Component)');
    // Anonymous component falls back to "Component"
    expect(injectReducer({ key: 'test', reducer })(() => null).displayName).toBe('withReducer(Component)');
  });

  it('should propagate props', () => {
    const store: AppStore = configureStore({});
    const received: Record<string, unknown>[] = [];
    const Probe: React.FC<Record<string, unknown>> = (props) => {
      received.push(props);
      return null;
    };
    const ComponentWithReducer = injectReducer({ key: 'test', reducer })(Probe);
    TestRenderer.act(() => {
      TestRenderer.create(
        <Provider store={store}>
          <ComponentWithReducer testProp="test" />
        </Provider>,
      );
    });
    expect(received[0].testProp).toBe('test');
  });
});
