/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

import type {
  HomeState,
  AddressMap,
  TokenMap,
  TokenInfo,
  ExchangeRates,
} from './reducer';

// The redux state tree is plain JS; the 'home' domain is injected dynamically
// by injectReducer, so it may be undefined before injection.
interface RootState {
  home?: HomeState;
}

const selectHome = (state: RootState) => state.home;


const makeSelectIsShowGenerateWallet = () => createSelector(
  selectHome,
  (homeState) => homeState?.isShowGenerateWallet
);

const makeSelectGenerateWalletLoading = () => createSelector(
  selectHome,
  (homeState) => homeState?.generateWalletLoading
);

const makeSelectGenerateWalletError = () => createSelector(
  selectHome,
  (homeState) => homeState?.generateWalletError
);


const makeSelectGenerateKeystoreLoading = () => createSelector(
  selectHome,
  (homeState) => homeState?.generateKeystoreLoading
);

const makeSelectGenerateKeystoreError = () => createSelector(
  selectHome,
  (homeState) => homeState?.generateKeystoreError
);

const makeSelectRestoreWalletError = () => createSelector(
  selectHome,
  (homeState) => homeState?.restoreWalletError
);

const makeSelectSeed = () => createSelector(
  selectHome,
  (homeState) => homeState?.seed
);

const makeSelectPassword = () => createSelector(
  selectHome,
  (homeState) => homeState?.password
);

const makeSelectIsComfirmed = () => createSelector(
  selectHome,
  (homeState) => homeState?.isComfirmed
);


const makeSelectKeystore = () => createSelector(
  selectHome,
  (homeState) => homeState?.keystore
);

const makeSelectShowRestoreWallet = () => createSelector(
  selectHome,
  (homeState) => homeState?.isShowRestoreWallet
);

const makeSelectUserSeed = () => createSelector(
  selectHome,
  (homeState) => homeState?.userSeed
);
const makeSelectUserPassword = () => createSelector(
  selectHome,
  (homeState) => homeState?.userPassword
);

const makeSelectIsShowSendToken = () => createSelector(
  selectHome,
  (homeState) => homeState?.isShowSendToken
);

const makeSelectIsShowTokenChooser = () => createSelector(
  selectHome,
  (homeState) => homeState?.isShowTokenChooser
);

/*
* Deprecated, use makeSelectAddressMap instead.
*
*/
const makeSelectAddressList = () => createSelector(
  selectHome,
  (homeState) => homeState?.addressList
);

/**
 * returns map for specific given address or map of all addresses if no address is given
 * {
 *   index: 1 // optional
 *   eth: {balance: bigNumber / false},
 *   eos: {balance: bigNumber / false},
 *   ppt: {balance: bigNumber / false},
 * }
 * to return array of all adresses use: makeSelectAddress(false, { returnList: true })
 *
 * @param  {string} address as string (optional) returns map of all addresses if not provided
 * @param  {object} options may include the following:
 * @param  {boolean} options.returnList should returned array from keys instead of map? (optional)
 * @param  {boolean} options.removeIndex should remove the key index? (optional)
 * @param  {boolean} options.removeEth should remove the key eth? (optional)
 *
 * @return {object} An object which holds the tokens and balances or array
 */
interface AddressMapOptions {
  returnList?: boolean;
  removeIndex?: boolean;
  removeEth?: boolean;
}

const makeSelectAddressMap = (address?: string | false, options: AddressMapOptions = {}) => createSelector(
  selectHome,
  (homeState): TokenMap | AddressMap | string[] | null => {
    const { returnList, removeIndex, removeEth } = options;
    const addressList = homeState?.addressList;
    const addressMap = address ? (addressList ? addressList[address] : undefined) : addressList;
    if (!addressMap) {
      return null;
    }
    let result = addressMap;
    if (address && (removeIndex || removeEth)) {
      // Single-address branch: addressMap is a TokenMap; copy before omitting
      // keys, matching the old Immutable .delete() semantics.
      const tokenMap: TokenMap = { ...(addressMap as TokenMap) };
      if (removeIndex) {
        delete tokenMap.index;
      }
      if (removeEth) {
        delete tokenMap.eth;
      }
      result = tokenMap;
    }
    return returnList ? Object.keys(result) : result;
  }
);


const makeSelectAddressListLoading = () => createSelector(
  selectHome,
  (homeState) => homeState?.addressListLoading
);
const makeSelectAddressListError = () => createSelector(
  selectHome,
  (homeState) => homeState?.addressListError
);
const makeSelectAddressListMsg = () => createSelector(
  selectHome,
  (homeState) => homeState?.addressListMsg
);
const makeSelectExchangeRates = () => createSelector(
  selectHome,
  (homeState): ExchangeRates | undefined => homeState?.exchangeRates
);

const makeSelectConvertTo = () => createSelector(
  selectHome,
  (homeState) => homeState?.convertTo
);

/**
 * returns details object for specific given symbol or map of all symbols if no symbol is given
 * for makeSelectTokenInfo('symb') we get:
 * {
 *  icon: 'populous_28.png',
 *  name: 'Sample',
 *  contractAddress: '0xd5b3812e67847af90aa5835abd5c253ff5252ec2',
 *  decimals: 1,
 * },
 * returns null if no info for given token symbol
 * to return array of all symbols use: makeSelectAddress(false, { returnList: true })
 *
 * @param  {string} [symbol] as string (optional) returns map of all symbols if not provided
 *
 * @return {object} An object which holds the tokensInfo for given symbol
 */
const makeSelectTokenInfo = (symbol?: string) => createSelector(
  selectHome,
  (homeState): TokenInfo | Record<string, TokenInfo> | null => {
    const tokenInfo = symbol ? homeState?.tokenInfo?.[symbol] : homeState?.tokenInfo;
    if (tokenInfo) {
      return tokenInfo;
    }
    return null;
  }
);
/* return array of tokens from tokenInfo : ['eth','eos','ppt'] */
const makeSelectTokenInfoList = () => createSelector(
  selectHome,
  (homeState) => (homeState?.tokenInfo ? Object.keys(homeState.tokenInfo) : undefined)
);

/**
 * returns decimals map for all tokens
 *{
 *  eth: 18,
 *  eos: 18,
 *  ppt: 3
 *},
 * @return {object} An object which holds the decimals map
 */
const makeSelectTokenDecimalsMap = () => createSelector(
  selectHome,
  (homeState) => {
    const tokenInfo = homeState?.tokenInfo ? homeState.tokenInfo : {};
    return Object.assign({}, ...Object.keys(tokenInfo).map((k) => ({ [k]: tokenInfo[k].decimals })));
  }
);

const makeSelectSaveWalletLoading = () => createSelector(
  selectHome,
  (homeState) => homeState?.saveWalletLoading
);
const makeSelectSaveWalletError = () => createSelector(
  selectHome,
  (homeState) => homeState?.saveWalletError
);
const makeSelectLoadWalletLoading = () => createSelector(
  selectHome,
  (homeState) => homeState?.loadWalletLoading
);
const makeSelectLoadwalletError = () => createSelector(
  selectHome,
  (homeState) => homeState?.loadWalletError
);

export {
  selectHome,
  makeSelectIsShowGenerateWallet,
  makeSelectGenerateWalletLoading,
  makeSelectGenerateWalletError,
  makeSelectGenerateKeystoreLoading,
  makeSelectGenerateKeystoreError,
  makeSelectRestoreWalletError,
  makeSelectSeed,
  makeSelectPassword,
  makeSelectIsComfirmed,
  makeSelectKeystore,
  makeSelectShowRestoreWallet,
  makeSelectUserSeed,
  makeSelectUserPassword,
  makeSelectIsShowSendToken,
  makeSelectIsShowTokenChooser,

  makeSelectAddressList,
  makeSelectAddressListLoading,
  makeSelectAddressListError,
  makeSelectAddressListMsg,
  makeSelectAddressMap,
  // makeSelectTokenMap,

  makeSelectExchangeRates,
  // makeSelectExchangeRate,
  makeSelectConvertTo,
  makeSelectTokenInfoList,
  makeSelectTokenInfo,
  makeSelectTokenDecimalsMap,

  makeSelectSaveWalletLoading,
  makeSelectSaveWalletError,
  makeSelectLoadWalletLoading,
  makeSelectLoadwalletError,
};
