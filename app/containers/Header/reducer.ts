/*
 *
 * Header reducer
 *
 */

import { CLOSE_WALLET } from 'containers/HomePage/constants';
import { defaultNetwork } from 'utils/constants';
import {
  LOAD_NETWORK,
  LOAD_NETWORK_SUCCESS,
  LOAD_NETWORK_ERROR,

  CHECK_BALANCES,
  CHECK_BALANCES_SUCCESS,
  CHECK_BALANCES_ERROR,

  GET_EXCHANGE_RATES,
  GET_EXCHANGE_RATES_SUCCESS,
  GET_EXCHANGE_RATES_ERROR,

  ASK_FAUCET_ERROR,
  ASK_FAUCET_SUCCESS,

} from './constants';


import Network from './network';

export interface HeaderState {
  loading: boolean;
  error: unknown;
  networkReady: boolean; // true only if network initialized and valid keystore attached
  prevNetworkName: string;
  networkName: string;
  blockNumber: number | bigint;
  availableNetworks: string[];

  checkingBalanceDoneTime: false | string; // should update after every succesfull balance check
  checkingBalances: boolean; // Loading
  checkingBalancesError: unknown;

  getExchangeRatesDoneTime: false | string; // should update after every succesfull exchange rate check
  getExchangeRatesLoading: boolean;
  getExchangeRatesError: unknown;

  usedFaucet: boolean; // to prevent offer more then once
}

// The initial state of the App
const initialState: HeaderState = {
  loading: false,
  error: false,
  networkReady: false, // true only if network initialized and valid keystore attached
  prevNetworkName: defaultNetwork,
  networkName: 'Offline',
  blockNumber: 0,
  availableNetworks: Object.keys(Network),

  checkingBalanceDoneTime: false, // should update after every succesfull balance check
  checkingBalances: false, // Loading
  checkingBalancesError: false,

  getExchangeRatesDoneTime: false, // should update after every succesfull exchange rate check
  getExchangeRatesLoading: false,
  getExchangeRatesError: false,

  usedFaucet: false, // to prevent offer more then once
};

interface HeaderAction {
  type: string;
  networkName?: string;
  blockNumber?: number | bigint;
  error?: unknown;
  timeString?: string;
}

function headerReducer(state: HeaderState = initialState, action: HeaderAction): HeaderState {
  switch (action.type) {
    case LOAD_NETWORK:
      return {
        ...state,
        loading: true,
        error: false,
        // dont change prevNetworkName when going online
        prevNetworkName: (state.networkName === 'Offline') ? state.prevNetworkName : state.networkName,
        // SAFETY: action.networkName is always set by loadNetwork() in actions.ts
        networkName: action.networkName as string,
      };
    case LOAD_NETWORK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        // SAFETY: action.blockNumber is always set by loadNetworkSuccess() in actions.ts
        blockNumber: action.blockNumber as number | bigint,
        networkReady: true,
      };
    case LOAD_NETWORK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
        networkReady: false,
      };

    case CHECK_BALANCES:
      return {
        ...state,
        checkingBalances: true,
        checkingBalancesError: false,
        checkingBalanceDoneTime: false,
      };
    case CHECK_BALANCES_SUCCESS:
      return {
        ...state,
        checkingBalances: false,
        checkingBalancesError: false,
        // SAFETY: action.timeString is always set by checkBalancesSuccess() in actions.ts
        checkingBalanceDoneTime: action.timeString as string,
      };
    case CHECK_BALANCES_ERROR:
      return {
        ...state,
        checkingBalances: false,
        checkingBalancesError: action.error,
        checkingBalanceDoneTime: false,
      };

    case GET_EXCHANGE_RATES:
      return {
        ...state,
        getExchangeRatesLoading: true,
        getExchangeRatesError: false,
        getExchangeRatesDoneTime: false,
      };
    case GET_EXCHANGE_RATES_SUCCESS:
      return {
        ...state,
        getExchangeRatesLoading: false,
        getExchangeRatesError: false,
        // SAFETY: action.timeString is always set by getExchangeRatesSuccess() in actions.ts
        getExchangeRatesDoneTime: action.timeString as string,
      };
    case GET_EXCHANGE_RATES_ERROR:
      return {
        ...state,
        getExchangeRatesLoading: false,
        getExchangeRatesError: action.error,
        getExchangeRatesDoneTime: false,
      };

    case ASK_FAUCET_SUCCESS:
      return {
        ...state,
        usedFaucet: true,
      };
    case ASK_FAUCET_ERROR:
      return state;

    case CLOSE_WALLET:
      return {
        ...state,
        usedFaucet: false,
      };

    default:
      return state;
  }
}

export default headerReducer;
