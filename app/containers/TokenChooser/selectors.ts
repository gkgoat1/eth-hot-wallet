import { createSelector } from 'reselect';
import type { TokenChooserState } from './reducer';

/**
 * Direct selector to the tokenChooser state domain
 */
const selectTokenChooserDomain = (state: { tokenchooser: TokenChooserState }) =>
  state.tokenchooser;

const makeSelectChosenTokens = () =>
  createSelector(
    selectTokenChooserDomain,
    // Previously this returned substate.get('chosenTokens').toJS(); with a
    // plain-object state tree the value is already a plain object, returned
    // directly (consumers index it as Record<string, boolean>).
    (substate) => substate.chosenTokens,
  );

export { selectTokenChooserDomain, makeSelectChosenTokens };
