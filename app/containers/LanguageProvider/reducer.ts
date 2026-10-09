/*
 *
 * LanguageProvider reducer
 *
 */

import { fromJS } from 'immutable';

import {
  CHANGE_LOCALE,
} from './constants';
import {
  DEFAULT_LOCALE,
} from '../App/constants'; // eslint-disable-line

const initialState = fromJS({
  locale: DEFAULT_LOCALE,
});

// Loose action shape; matches ChangeLocaleAction in ./actions.
interface LanguageProviderAction {
  type: string;
  locale?: string;
}

function languageProviderReducer(state = initialState, action: LanguageProviderAction) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return state
        .set('locale', action.locale);
    default:
      return state;
  }
}

export default languageProviderReducer;
