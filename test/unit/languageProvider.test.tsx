/**
 * LanguageProvider component test (Phase 6: react-test-renderer@18, i18n is
 * disabled app-wide so LanguageProvider is a children pass-through).
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';

import ConnectedLanguageProvider, { LanguageProvider } from '../../app/containers/LanguageProvider';
import configureStore, { type AppStore } from '../../app/store';

describe('<LanguageProvider />', () => {
  it('should render its children', () => {
    const children = <h1>Test</h1>;
    let renderer: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <LanguageProvider>{children}</LanguageProvider>,
      );
    });
    expect(renderer!.root.findByType('h1').children).toEqual(['Test']);
  });
});

describe('<ConnectedLanguageProvider />', () => {
  let store: AppStore;

  beforeAll(() => {
    store = configureStore({});
  });

  it('should render its children through the redux-connected wrapper', () => {
    let renderer: TestRenderer.ReactTestRenderer;
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <Provider store={store}>
          <ConnectedLanguageProvider>
            <h1>Connected</h1>
          </ConnectedLanguageProvider>
        </Provider>,
      );
    });
    expect(renderer!.root.findByType('h1').children).toEqual(['Connected']);
  });
});
