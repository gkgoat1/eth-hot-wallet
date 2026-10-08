import { createSelector } from 'reselect';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = (state: { get: (k: string) => unknown }) => state.get('language');

/**
 * Select the language locale
 */
const makeSelectLocale = () =>
  createSelector(selectLanguage, (languageState) =>
    (languageState as { get: (k: string) => unknown }).get('locale'),
  );

export { selectLanguage, makeSelectLocale };
