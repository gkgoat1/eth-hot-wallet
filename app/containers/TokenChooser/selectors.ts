import { createSelector } from 'reselect';

/**
 * Direct selector to the tokenChooser state domain
 */
const selectTokenChooserDomain = (state: { get: (k: string) => unknown }) =>
  state.get('tokenchooser');

const makeSelectChosenTokens = () =>
  createSelector(selectTokenChooserDomain, (substate) =>
    (substate as { get: (k: string) => { toJS: () => unknown } }).get('chosenTokens').toJS(),
  );

export { selectTokenChooserDomain, makeSelectChosenTokens };
