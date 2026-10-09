/**
 * Combine all reducers in this file and export the combined reducers.
 *
 * Phase 6 immutable-removal: redux-immutable's combineReducers and
 * react-router-redux's LOCATION_CHANGE/routeReducer are dropped. The state
 * tree is now plain JS objects combined by redux's combineReducers, and
 * React Router v6 owns routing (no 'route' state key).
 */
import { combineReducers } from 'redux';

import languageProviderReducer, {
  type LanguageProviderState,
} from 'containers/LanguageProvider/reducer';

/**
 * Loose reducer type used for injected reducers. SAFETY: the explicit
 * `unknown, unknown` signature makes dynamically injected reducers assignable
 * regardless of their concrete state/action types; redux dispatch is
 * dynamically typed at runtime anyway. Consumers (utils/reducerInjectors.ts)
 * cast the combined reducer back to this same loose type.
 */
type Reducer = (state: unknown, action: unknown) => unknown;

/**
 * Creates the main reducer with the dynamically injected ones.
 */
export default function createReducer(injectedReducers?: Record<string, Reducer>): Reducer {
  // SAFETY: redux's combineReducers<S, A> computes S from the reducer map,
  // which is unrepresentable for the loose injected-reducer map; the store
  // treats the result as the loose `Reducer` type above.
  const combined = combineReducers({
    language: languageProviderReducer,
    ...injectedReducers,
  } as never);
  return combined as unknown as Reducer;
}

/**
 * The plain-object shape of the root state slice this module knows about.
 * Additional keys arrive via reducer injection at runtime.
 */
export interface RootState {
  language: LanguageProviderState;
  [key: string]: unknown;
}
