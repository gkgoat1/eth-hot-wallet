/*
 *
 * LanguageProvider reducer
 *
 * Phase 6 immutable-removal: state is a plain JS object.
 */

import {
  CHANGE_LOCALE,
} from './constants';
import {
  DEFAULT_LOCALE,
} from '../App/constants'; // eslint-disable-line

export interface LanguageProviderState {
  locale: string;
}

const initialState: LanguageProviderState = {
  locale: DEFAULT_LOCALE,
};

// Loose action shape; matches ChangeLocaleAction in ./actions.
interface LanguageProviderAction {
  type: string;
  locale?: string;
}

function languageProviderReducer(
  state = initialState,
  action: LanguageProviderAction,
): LanguageProviderState {
  switch (action.type) {
    case CHANGE_LOCALE:
      return {
        ...state,
        // SAFETY: CHANGE_LOCALE actions always carry a locale string
        // (see ./actions changeLocale); the optional field exists only to
        // type arbitrary unrelated actions reaching this reducer.
        locale: action.locale as string,
      };
    default:
      return state;
  }
}

export default languageProviderReducer;
