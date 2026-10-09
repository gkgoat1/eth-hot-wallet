/**
 * Combine all reducers in this file and export the combined reducers.
 */
// SAFETY: redux-immutable@4 bundles no type declarations. The import below
// is the runtime value (an `any` module under strict mode); the explicit
// `combineReducers` binding right after re-types it at the boundary. Its API
// mirrors redux's combineReducers but over an Immutable state tree.
// @ts-expect-error TS7016: redux-immutable ships no type declarations
import { combineReducers as combineReducersUntyped } from 'redux-immutable';
import { fromJS } from 'immutable';
// SAFETY: react-router-redux@5.0.0-alpha.9 bundles no type declarations, so
// TS7016 is suppressed on the import; LOCATION_CHANGE is the string action
// type constant it exports, and is typed explicitly at the binding below.
// @ts-expect-error TS7016: react-router-redux ships no type declarations
import { LOCATION_CHANGE as LOCATION_CHANGE_UNTYPED } from 'react-router-redux';

import languageProviderReducer from 'containers/LanguageProvider/reducer';

type Reducer = (state: unknown, action: unknown) => unknown;

// Explicitly typed bindings over the untyped module imports above.
const combineReducers: (reducers: Record<string, Reducer>) => Reducer = combineReducersUntyped;
const LOCATION_CHANGE: string = LOCATION_CHANGE_UNTYPED;

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action: { type: string; payload?: unknown }) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers?: Record<string, Reducer>) {
  return combineReducers({
    route: routeReducer,
    language: languageProviderReducer,
    ...injectedReducers,
  } as never);
}
