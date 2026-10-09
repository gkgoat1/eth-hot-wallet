/**
 * Test the injectSaga HOC (Phase 6: hooks-based, react-test-renderer@18).
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import { put } from 'redux-saga/effects';

import configureStore, { type AppStore } from '../../app/store';
import injectSaga from '../../app/utils/injectSaga';
import type { InjectableStore } from '../../app/utils/checkStore';
import { ONCE_TILL_UNMOUNT } from '../../app/utils/constants';

const Component: React.FC<Record<string, unknown>> = () => null;

function* testSaga(): Generator<unknown, void, unknown> {
  yield put({ type: 'TEST', payload: 'yup' });
}

describe('injectSaga decorator', () => {
  it('should inject given saga on mount', () => {
    const store: AppStore = configureStore({});
    const runSpy = vi.spyOn(store, 'runSaga' as never);

    const ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga })(Component);
    TestRenderer.act(() => {
      TestRenderer.create(
        <Provider store={store}>
          <ComponentWithSaga />
        </Provider>,
      );
    });

    expect(store.injectedSagas.test).toBeDefined();
    expect(runSpy).toHaveBeenCalled();
  });

  it('should eject on unmount with a correct saga key', () => {
    const store: AppStore = configureStore({});
    const cancel = vi.fn();
    // Pre-seed a fake injected task so ejectSaga cancels it.
    (store as InjectableStore).injectedSagas.test = {
      saga: testSaga,
      task: { cancel },
    } as never;

    const ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga, mode: ONCE_TILL_UNMOUNT })(Component);
    let renderer: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <Provider store={store}>
          <ComponentWithSaga />
        </Provider>,
      );
    });
    TestRenderer.act(() => {
      renderer.unmount();
    });

    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('should set a correct display name', () => {
    const Wrapped = injectSaga({ key: 'test', saga: testSaga })(Component);
    expect(Wrapped.displayName).toBe('withSaga(Component)');
    expect(injectSaga({ key: 'test', saga: testSaga })(() => null).displayName).toBe('withSaga(Component)');
  });

  it('should propagate props', () => {
    const store: AppStore = configureStore({});
    const received: Record<string, unknown>[] = [];
    const Probe: React.FC<Record<string, unknown>> = (props) => {
      received.push(props);
      return null;
    };
    const ComponentWithSaga = injectSaga({ key: 'test', saga: testSaga })(Probe);
    TestRenderer.act(() => {
      TestRenderer.create(
        <Provider store={store}>
          <ComponentWithSaga testProp="test" />
        </Provider>,
      );
    });
    expect(received[0].testProp).toBe('test');
  });
});
