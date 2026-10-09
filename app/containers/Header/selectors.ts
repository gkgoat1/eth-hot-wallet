import { createSelector } from 'reselect';
import Network from './network';
import type { HeaderState } from './reducer';

type RootState = { header: HeaderState };

/**
 * Direct selector to the header state domain
 */
const selectHeaderDomain = (state: RootState) => state.header;

const makeSelectLoading = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.loading
);

const makeSelectError = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.error
);

const makeSelectNetworkName = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.networkName
);
const makeSelectPrevNetworkName = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.prevNetworkName
);
const makeSelectTxExplorer = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? Network[substate.networkName].tx_explorer : null
);
const makeSelectAvailableNetworks = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.availableNetworks
);

const makeSelectBlockNumber = () => createSelector(
  selectHeaderDomain,
  (substate) => substate.blockNumber
);

/* Will return null if header didn't loaded yet (initial load) */
const makeSelectNetworkReady = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.networkReady : null
);

const makeSelectCheckingBalanceDoneTime = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.checkingBalanceDoneTime : null
);

const makeSelectCheckingBalances = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.checkingBalances : null
);

const makeSelectCheckingBalancesError = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.checkingBalancesError : null
);

const makeSelectGetExchangeRatesDoneTime = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.getExchangeRatesDoneTime : null
);

const makeSelectGetExchangeRatesLoading = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.getExchangeRatesLoading : null
);

const makeSelectGetExchangeRatesError = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.getExchangeRatesError : null
);

// faucet
const makeSelectUsedFaucet = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? substate.usedFaucet : null
);

// The checkFaucet*/askFaucet* keys are not part of HeaderState (never written
// by the reducer); reading them previously returned undefined from the
// Immutable.Map, and now returns undefined from the plain object.
// SAFETY: keys absent from HeaderState (read via unknown cast), preserved for API compatibility.
const makeSelectCheckFaucetLoading = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? (substate as unknown as Record<string, unknown>).checkFaucetLoading : null
);
const makeSelectCheckFaucetSuccess = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? (substate as unknown as Record<string, unknown>).checkFaucetSuccess : null
);
const makeSelectAskFaucetLoading = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? (substate as unknown as Record<string, unknown>).askFaucetLoading : null
);
const makeSelectAskFaucetSuccess = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? (substate as unknown as Record<string, unknown>).askFaucetSuccess : null
);
const makeSelectAskFaucetError = () => createSelector(
  selectHeaderDomain,
  (substate) => substate ? (substate as unknown as Record<string, unknown>).askFaucetError : null
);

// export default makeSelectHeader;
export {
  selectHeaderDomain,
  makeSelectNetworkReady,
  makeSelectLoading,
  makeSelectError,
  makeSelectPrevNetworkName,
  makeSelectNetworkName,
  makeSelectTxExplorer,
  makeSelectAvailableNetworks,
  makeSelectBlockNumber,
  makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError,
  makeSelectGetExchangeRatesDoneTime,
  makeSelectGetExchangeRatesLoading,
  makeSelectGetExchangeRatesError,
  makeSelectUsedFaucet,
  makeSelectCheckFaucetLoading,
  makeSelectCheckFaucetSuccess,
  makeSelectAskFaucetLoading,
  makeSelectAskFaucetSuccess,
  makeSelectAskFaucetError,
};
