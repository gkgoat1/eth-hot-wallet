/*
 *
 * TokenChooser reducer
 *
 * Phase 6 immutable-removal: state is a plain JS object.
 */
import {
  TOGGLE_TOKEN,
} from './constants';

// Loose action shape for the actions this reducer handles.
interface TokenChooserAction {
  type: string;
  symbol?: string;
  toggle?: boolean;
}

export interface TokenChooserState {
  chosenTokens: Record<string, boolean>;
}

const initialState: TokenChooserState = {

  chosenTokens: { mero: true },

};

function tokenChooserReducer(
  state = initialState,
  action: TokenChooserAction,
): TokenChooserState {
  switch (action.type) {
    case TOGGLE_TOKEN:
      return {
        ...state,
        chosenTokens: {
          ...state.chosenTokens,
          // SAFETY: TOGGLE_TOKEN actions always carry symbol/toggle
          // (see ./actions toggleToken); the optional fields exist only to
          // type arbitrary unrelated actions reaching this reducer.
          [action.symbol as string]: action.toggle as boolean,
        },
      };
    default:
      return state;
  }
}

export default tokenChooserReducer;
