/**
 * i18n formatTranslationMessages test.
 */

import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_LOCALE } from '../../app/containers/App/constants';

// The real en.json is a placeholder `[]`; mock it with default messages so
// the fallback-merge logic can be exercised.
vi.mock('../../app/translations/en.json', () => ({
  default: {
    message1: 'default message',
    message2: 'default message 2',
  },
}));

import { formatTranslationMessages } from '../../app/i18n';

const esTranslationMessages = {
  message1: 'mensaje predeterminado',
  message2: '',
};

describe('formatTranslationMessages', () => {
  it('should build only defaults when DEFAULT_LOCALE', () => {
    const result = formatTranslationMessages(DEFAULT_LOCALE, { a: 'a' });
    expect(result).toEqual({ a: 'a' });
  });

  it('should combine default locale and current locale when not DEFAULT_LOCALE', () => {
    const result = formatTranslationMessages('', esTranslationMessages);
    expect(result).toEqual({
      message1: 'mensaje predeterminado',
      message2: 'default message 2',
    });
  });
});
