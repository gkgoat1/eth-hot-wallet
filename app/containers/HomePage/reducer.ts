/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return { ...state, yourStateVariable: true };
 */
import type { Reducer } from 'redux';

import {
  GENERATE_WALLET,
  GENERATE_WALLET_SUCCESS,
  GENERATE_WALLET_ERROR,
  GENERATE_WALLET_CANCEL,

  GENERATE_KEYSTORE,
  GENERATE_KEYSTORE_SUCCESS,
  GENERATE_KEYSTORE_ERROR,
  SHOW_RESTORE_WALLET,
  RESTORE_WALLET_CANCEL,
  CHANGE_USER_SEED,
  CHANGE_USER_PASSWORD,
  RESTORE_WALLET_FROM_SEED,
  RESTORE_WALLET_FROM_SEED_ERROR,
  RESTORE_WALLET_FROM_SEED_SUCCESS,

  CHANGE_BALANCE,

  SHOW_SEND_TOKEN,
  HIDE_SEND_TOKEN,
  SHOW_TOKEN_CHOOSER,
  HIDE_TOKEN_CHOOSER,

  UPDATE_TOKEN_INFO,

  GENERATE_ADDRESS,
  GENERATE_ADDRESS_SUCCESS,
  GENERATE_ADDRESS_ERROR,

  LOCK_WALLET,
  UNLOCK_WALLET,
  UNLOCK_WALLET_SUCCESS,
  UNLOCK_WALLET_ERROR,

  SET_EXCHANGE_RATES,
  SELECT_CURRENCY,

  CLOSE_WALLET,

  CHECK_LOCAL_STORAGE,
  LOCAL_STORAGE_EXIST,
  LOCAL_STORAGE_NOT_EXIST,

  SAVE_WALLET,
  SAVE_WALLET_SUCCESS,
  SAVE_WALLET_ERROR,

  LOAD_WALLET,
  LOAD_WALLET_SUCCESS,
  LOAD_WALLET_ERROR,
} from './constants';

// The wallet's per-token entry for one address (e.g. { balance: BigNumber|false }).
export interface TokenEntry {
  balance?: unknown;
  [key: string]: unknown;
}

// One address's token map: { index?: number, eth: {...}, omg: {...}, ... }.
export interface TokenMap {
  index?: number;
  [symbol: string]: unknown;
}

// address -> TokenMap, or `false` before a keystore exists.
export type AddressMap = Record<string, TokenMap>;

export interface TokenInfo {
  name?: string;
  symbol?: string;
  contractAddress?: string | null;
  decimals?: number;
  [key: string]: unknown;
}

export type ExchangeRates = Record<string, unknown>;

// Plain-JS shape of the 'home' state. The `false` sentinels and the optional
// local-storage keys mirror the previous Immutable Map exactly — including the
// checkLocalStorage*/isLocalStorageWallet keys, which existed only after a
// CHECK_LOCAL_STORAGE/LOCAL_STORAGE_* action and thus read as `undefined`.
export interface HomeState {
  isShowGenerateWallet: boolean;
  generateWalletLoading: boolean; // generate new seed and password
  generateWalletError: unknown;
  password: unknown; // string | false
  seed: unknown; // string | false

  generateKeystoreLoading: boolean;
  generateKeystoreError: unknown; // if error - no addressList displayed

  isShowRestoreWallet: boolean;
  userSeed: string;
  userPassword: string;
  restoreWalletError: unknown;

  isComfirmed: boolean; // if true then we have a valid keystore

  keystore: unknown; // keystore instance | false
  addressList: AddressMap | false;

  exchangeRates: ExchangeRates;
  convertTo: unknown; // string; was fromJS-wrapped in the Immutable state

  addressListLoading: boolean; // for addressList loading and error
  addressListError: unknown;
  addressListMsg: unknown; // string | false

  isShowSendToken: boolean;
  isShowTokenChooser: boolean;

  saveWalletLoading: boolean;
  saveWalletError: unknown;
  loadWalletLoading: boolean;
  loadWalletError: unknown;

  tokenInfo: Record<string, TokenInfo>;

  // Set by CHECK_LOCAL_STORAGE / LOCAL_STORAGE_* actions; absent from
  // initialState before, so they surface as `undefined` until then.
  checkLocalStorageLoading?: boolean;
  isLocalStorageWallet?: boolean;
}

// The initial state of the App
const initialState: HomeState = {
  isShowGenerateWallet: false,
  generateWalletLoading: false, // generate new seed and password
  generateWalletError: false,
  password: false,
  seed: false,

  generateKeystoreLoading: false,
  generateKeystoreError: false, // if error - no addressList displayed

  isShowRestoreWallet: false,
  userSeed: '',
  userPassword: '',
  restoreWalletError: false,

  isComfirmed: false, // if true then we have a valid keystore

  keystore: false,
  addressList: false,

  /*
  addressList: {
    address1: {
        order: 1
        eth: {balance: bigNumber},
        eos: {balance: bigNumber},
        ppt: {balance: bigNumber},
      }
  } */

  exchangeRates: {},
  convertTo: 'eth_usd',

  addressListLoading: false, // for addressList loading and error
  addressListError: false,
  addressListMsg: false,

  isShowSendToken: false,
  isShowTokenChooser: false,

  saveWalletLoading: false,
  saveWalletError: false,
  loadWalletLoading: false,
  loadWalletError: false,

  tokenInfo: {
    eth: {
      name: 'Ethereum',
      contractAddress: null,
      decimals: 18,
    },
    omg: {
      name: 'OmiseGo',
      contractAddress: '0xbcad569fe454e78ca90e4120d89b6b69f8db402f',
      decimals: 18,
    },
    bat: {
      name: 'Basic Attention Token',
      contractAddress: '0xf3a1c162bc4a82ca5227d7c542c20dd087d2c37b',
      decimals: 18,
    },
    mkr: {
      symbol: 'mkr',
      name: 'Maker',
      contractAddress: '0xece9fa304cc965b00afc186f5d0281a00d3dbbfd',
      decimals: 18,
    },
  },
};

// Actions handled here carry heterogeneous payloads (seed, keystore, addressMap,
// error, ...); the reducer only reads them via action.* so a loose shape is fine.
interface HomeAction {
  type: string;
  [key: string]: unknown;
}

function homeReducer(state: HomeState = initialState, action: HomeAction): HomeState {
  switch (action.type) {

    case GENERATE_WALLET:
      return {
        ...state,
        isShowGenerateWallet: true,
        generateWalletLoading: true,
        generateWalletError: false,
      };
    case GENERATE_WALLET_SUCCESS:
      return {
        ...state,
        generateWalletLoading: false,
        seed: action.seed,
        password: action.password,
      };
    case GENERATE_WALLET_ERROR:
      return {
        ...state,
        generateWalletLoading: false,
        generateWalletError: action.error,
      };
    case GENERATE_WALLET_CANCEL:
      return {
        ...state,
        isShowGenerateWallet: false,
        generateWalletLoading: true,
        generateWalletError: false,
        password: false,
        seed: false,
      };

    case GENERATE_KEYSTORE:
      return {
        ...state,
        isShowGenerateWallet: false,
        generateKeystoreLoading: true,
        generateKeystoreError: false,
      };
    case GENERATE_KEYSTORE_SUCCESS:
      return {
        ...state,
        keystore: action.keystore,
        seed: false,
        isComfirmed: true,
        addressListError: false,
        addressList: action.addressMap as AddressMap,
        generateKeystoreLoading: false,
      };
    case GENERATE_KEYSTORE_ERROR:
      return {
        ...state,
        generateKeystoreLoading: false,
        generateKeystoreError: action.error,
        isComfirmed: false,
      };

    case SHOW_RESTORE_WALLET:
      return {
        ...state,
        isShowRestoreWallet: true,
        seed: false,
        userSeed: '',
      };
    case RESTORE_WALLET_CANCEL:
      return {
        ...state,
        isShowRestoreWallet: false,
        userPassword: '',
        userSeed: '',
        restoreWalletError: false,
      };
    case CHANGE_USER_SEED:
      return {
        ...state,
        userSeed: action.userSeed as string, // Delete prefixed space from user seed
      };
    case CHANGE_USER_PASSWORD:
      return {
        ...state,
        userPassword: action.password as string,
      };
    case RESTORE_WALLET_FROM_SEED:
      return {
        ...state,
        restoreWalletError: false,
        isComfirmed: false,
      };
    case RESTORE_WALLET_FROM_SEED_ERROR:
      return {
        ...state,
        restoreWalletError: action.error,
      };
    case RESTORE_WALLET_FROM_SEED_SUCCESS:
      return {
        ...state,
        isShowRestoreWallet: false,
        seed: action.userSeed,
        password: action.userPassword,
        userSeed: '',
        userPassword: '',
      };


    case CHANGE_BALANCE: {
      const address = action.address as string;
      const symbol = action.symbol as string;
      const prevAddressList = state.addressList || {};
      const prevTokenMap = prevAddressList[address] || {};
      // SAFETY: plain-object counterpart of the old
      // setIn([address, symbol, 'balance']) — assumes the token entry is a
      // plain object, exactly as the Immutable setIn assumed a Map.
      const prevTokenEntry = (prevTokenMap[symbol] || {}) as TokenEntry;
      return {
        ...state,
        addressList: {
          ...prevAddressList,
          [address]: {
            ...prevTokenMap,
            [symbol]: { ...prevTokenEntry, balance: action.balance },
          },
        },
      };
    }

    case SHOW_SEND_TOKEN:
      return {
        ...state,
        isShowSendToken: true,
      };
    case HIDE_SEND_TOKEN:
      return {
        ...state,
        isShowSendToken: false,
      };

    case SHOW_TOKEN_CHOOSER:
      return {
        ...state,
        isShowTokenChooser: true,
      };
    case HIDE_TOKEN_CHOOSER:
      return {
        ...state,
        isShowTokenChooser: false,
      };

    case UPDATE_TOKEN_INFO:
      return {
        ...state,
        isShowTokenChooser: false,
        addressListError: false,
        tokenInfo: action.tokenInfo as Record<string, TokenInfo>,
        addressList: action.addressMap as AddressMap,
      };

    case GENERATE_ADDRESS:
      return {
        ...state,
        addressListLoading: true,
        addressListError: false,
        addressListMsg: false,
      };
    case GENERATE_ADDRESS_SUCCESS: {
      const prevAddressList = state.addressList || {};
      return {
        ...state,
        addressListLoading: false,
        addressListError: false,
        addressListMsg: 'New address generated succesfully',
        addressList: {
          ...prevAddressList,
          [action.newAddress as string]: action.tokenMap as TokenMap,
        },
      };
    }
    case GENERATE_ADDRESS_ERROR:
      return {
        ...state,
        addressListLoading: false,
        addressListError: action.error,
      };


    case LOCK_WALLET:
      return {
        ...state,
        password: false,
      };
    case UNLOCK_WALLET:
      return state;
    case UNLOCK_WALLET_SUCCESS:
      return {
        ...state,
        password: action.password,
      };
    case UNLOCK_WALLET_ERROR:
      return state;


    case SET_EXCHANGE_RATES:
      return {
        ...state,
        exchangeRates: action.rates as ExchangeRates,
      };
    case SELECT_CURRENCY:
      return {
        ...state,
        convertTo: action.convertTo,
      };

    case CLOSE_WALLET:
      return initialState;

    case CHECK_LOCAL_STORAGE:
      return {
        ...state,
        checkLocalStorageLoading: true,
      };
    case LOCAL_STORAGE_EXIST:
      return {
        ...state,
        checkLocalStorageLoading: false,
        isLocalStorageWallet: true,
      };
    case LOCAL_STORAGE_NOT_EXIST:
      return {
        ...state,
        checkLocalStorageLoading: false,
        isLocalStorageWallet: false,
      };

    case SAVE_WALLET:
      return {
        ...state,
        saveWalletLoading: true,
        saveWalletError: false,
      };
    case SAVE_WALLET_SUCCESS:
      return {
        ...state,
        saveWalletLoading: false,
      };
    case SAVE_WALLET_ERROR:
      return {
        ...state,
        saveWalletLoading: false,
        saveWalletError: action.error,
      };

    case LOAD_WALLET:
      return {
        ...state,
        loadWalletLoading: true,
        loadWalletError: false,
      };
    case LOAD_WALLET_SUCCESS:
      return {
        ...state,
        loadWalletLoading: false,
      };
    case LOAD_WALLET_ERROR:
      return {
        ...state,
        loadWalletLoading: false,
        loadWalletError: action.error,
      };

    default:
      return state;
  }
}
/*
  LOCK_WALLET,
  UNLOCK_WALLET,
  UNLOCK_WALLET_SUCCESS,
  UNLOCK_WALLET_ERROR,
*/

export default homeReducer as Reducer<HomeState, HomeAction>;
