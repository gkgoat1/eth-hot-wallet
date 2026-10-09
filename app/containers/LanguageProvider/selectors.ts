import { createSelector } from 'reselect';
import type { LanguageProviderState } from './reducer';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = (state: { language: LanguageProviderState }) => state.language;

/**
 * Select the language locale
 */
const makeSelectLocale = () =>
  createSelector(selectLanguage, (languageState) => languageState.locale);

export { selectLanguage, makeSelectLocale };
