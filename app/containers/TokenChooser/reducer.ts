/*
 *
 * TokenChooser reducer
 *
 */

import { fromJS } from 'immutable';
import {
  TOGGLE_TOKEN,
} from './constants';

// Loose action shape for the actions this reducer handles.
interface TokenChooserAction {
  type: string;
  symbol?: string;
  toggle?: boolean;
}

const initialState = fromJS({

  chosenTokens: { mero: true },

});

function tokenChooserReducer(state = initialState, action: TokenChooserAction) {
  switch (action.type) {
    case TOGGLE_TOKEN:
      return state.setIn(['chosenTokens', action.symbol], action.toggle);
    default:
      return state;
  }
}

export default tokenChooserReducer;
