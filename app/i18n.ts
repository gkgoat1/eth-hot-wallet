/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
// import { addLocaleData } from 'react-intl';
// import enLocaleData from 'react-intl/locale-data/en';

import { DEFAULT_LOCALE } from './containers/App/constants'; // eslint-disable-line
import enTranslationMessagesJson from './translations/en.json';

// SAFETY: en.json is the placeholder `[]`, so its inferred type is never[].
// At runtime formatTranslationMessages only Object.keys()s it (yielding no
// keys), so it behaves exactly like an empty message map; the cast models
// that contract without touching the JSON file.
const enTranslationMessages = enTranslationMessagesJson as unknown as Record<string, string>;

export const appLocales = [
  'en',
];

// addLocaleData(enLocaleData);

export const formatTranslationMessages = (locale: string, messages: Record<string, string>): Record<string, string> => {
  const defaultFormattedMessages: Record<string, string> = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
    : {};
  return Object.keys(messages).reduce<Record<string, string>>((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, { [key]: message });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
};
