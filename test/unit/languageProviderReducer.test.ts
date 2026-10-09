/**
 * LanguageProvider reducer test (Phase 6: plain-JS state).
 */

import { describe, it, expect } from 'vitest';
import languageProviderReducer from '../../app/containers/LanguageProvider/reducer';
import { CHANGE_LOCALE } from '../../app/containers/LanguageProvider/constants';
import { DEFAULT_LOCALE } from '../../app/containers/App/constants';

describe('languageProviderReducer', () => {
  it('returns the initial state', () => {
    expect(languageProviderReducer(undefined, { type: '@@INIT' })).toEqual({
      locale: DEFAULT_LOCALE,
    });
  });

  it('changes the locale', () => {
    expect(
      languageProviderReducer(undefined, { type: CHANGE_LOCALE, locale: 'de' }),
    ).toEqual({ locale: 'de' });
  });
});
