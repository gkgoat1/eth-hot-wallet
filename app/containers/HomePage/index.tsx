/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import PropTypes from 'prop-types';

// @ts-ignore react-redux 5 has no bundled typings; connect is used untyped (React 15 legacy).
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

/* Components:  */
import AddressView from 'components/AddressView';
import SendToken from 'containers/SendToken';
// TokenChooser is still an untyped .jsx module; the connected component
// accepts the props spread below.
// @ts-ignore
import TokenChooser from 'containers/TokenChooser';
import GenerateWalletModal from 'components/GenerateWalletModal';
import RestoreWalletModal from 'components/RestoreWalletModal';
import SubHeader from 'components/SubHeader';
import PageFooter from 'components/PageFooter';
import { Content as StickyContent } from 'components/PageFooter/sticky';

// SAFETY: styled-components v2's bundled typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type lacks the `refs` member
// that @types/react@15's JSX.ElementClass requires. The runtime component is
// unchanged; this alias only re-types it for the app's React 15 JSX checking.
const Content = StickyContent as unknown as React.ComponentType<any>;

/* Header: */
import Header from 'containers/Header';
import { loadNetwork, checkBalances, getExchangeRates } from 'containers/Header/actions';
import {
  makeSelectNetworkReady,
  makeSelectCheckingBalanceDoneTime,
  makeSelectCheckingBalances,
  makeSelectCheckingBalancesError,
  makeSelectGetExchangeRatesDoneTime,
  makeSelectGetExchangeRatesLoading,
  makeSelectGetExchangeRatesError,
} from 'containers/Header/selectors';

/* General */
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';


/* HomePage */
import {
  generateWallet,
  generateWalletCancel,
  showRestoreWallet,
  restoreWalletCancel,
  generateKeystore,
  changeUserSeed,
  changeUserPassword,
  restoreWalletFromSeed,
  showSendToken,
  hideSendToken,
  showTokenChooser,
  hideTokenChooser,
  generateAddress,
  lockWallet,
  unlockWallet,
  selectCurrency,
  closeWallet,
  saveWallet,
  loadWallet,
} from './actions';

import {
  makeSelectIsShowGenerateWallet,
  makeSelectGenerateWalletLoading,
  makeSelectGenerateWalletError,
  makeSelectSeed,
  makeSelectGenerateKeystoreLoading,
  makeSelectGenerateKeystoreError,
  makeSelectRestoreWalletError,
  makeSelectPassword,
  makeSelectIsComfirmed,
  makeSelectUserSeed,
  makeSelectUserPassword,
  makeSelectAddressMap,
  makeSelectShowRestoreWallet,
  makeSelectIsShowSendToken,
  makeSelectIsShowTokenChooser,
  makeSelectAddressListLoading,
  makeSelectAddressListError,
  makeSelectAddressListMsg,
  makeSelectExchangeRates,
  makeSelectConvertTo,
  makeSelectSaveWalletLoading,
  makeSelectSaveWalletError,
  makeSelectLoadWalletLoading,
  makeSelectLoadwalletError,
  makeSelectTokenDecimalsMap,
} from './selectors';


// Loose DOM event type for the dispatched handlers below; they only touch
// preventDefault and (for input handlers) target.value.
interface HandlerEvent {
  preventDefault?: () => void;
  target?: { value: string };
}

interface HomePageProps {
  onGenerateWallet?: (evt?: HandlerEvent) => void;
  onGenerateWalletCancel?: (evt?: HandlerEvent) => void;
  isShowGenerateWallet?: boolean;
  generateWalletLoading?: boolean;
  generateWalletError?: object | string | boolean;
  seed?: string | boolean;
  password?: string | boolean;

  generateKeystoreLoading?: boolean;
  generateKeystoreError?: object | string | boolean;

  onGenerateKeystore?: (evt?: HandlerEvent) => void;
  // Always provided by mapDispatchToProps; AddressView requires it.
  onGenerateAddress: (evt?: HandlerEvent) => void;
  onShowRestoreWallet?: (evt?: HandlerEvent) => void;

  isShowRestoreWallet?: boolean;
  userSeed?: string;
  userPassword?: string;
  onChangeUserSeed?: (evt: HandlerEvent) => void;
  onChangeUserPassword?: (evt: HandlerEvent) => void;
  restoreWalletError?: object | string | boolean;
  onRestoreWalletFromSeed?: (evt?: HandlerEvent) => void;
  onRestoreWalletCancel?: (evt?: HandlerEvent) => void;

  // Always provided by mapDispatchToProps; AddressView requires them.
  onCheckBalances: (evt?: HandlerEvent) => void;

  onLockWallet?: (evt?: HandlerEvent) => void;
  onUnlockWallet?: (evt?: HandlerEvent) => void;

  isComfirmed?: boolean;
  addressMap?: boolean | object;
  // selectors.ts builds a plain object of token symbol -> decimals count.
  tokenDecimalsMap?: boolean | { [token: string]: number };

  isShowSendToken?: boolean;
  // Always provided by mapDispatchToProps; AddressView requires it.
  onShowSendToken: (address: string, tokenSymbol?: string) => void;
  onHideSendToken?: () => void;

  isShowTokenChooser?: boolean;
  // Always provided by mapDispatchToProps; AddressView requires it.
  onShowTokenChooser: () => void;
  onHideTokenChooser?: () => void;

  addressListLoading?: boolean;
  addressListError?: object | string | boolean;
  addressListMsg?: string | boolean;

  networkReady?: boolean;
  checkingBalanceDoneTime?: string | boolean;
  checkingBalances?: boolean;
  checkingBalancesError?: object | string | boolean;

  exchangeRates?: object;
  // Always provided by mapDispatchToProps; AddressView requires it.
  onSelectCurrency: (convertTo: string) => void;
  convertTo?: string | boolean;
  // Always provided by mapDispatchToProps; AddressView requires it.
  onGetExchangeRates: () => void;
  getExchangeRatesDoneTime?: string | boolean;
  getExchangeRatesLoading?: boolean;
  getExchangeRatesError?: object | string | boolean;
  onCloseWallet?: () => void;

  onSaveWallet?: () => void;
  saveWalletLoading?: boolean;
  saveWalletError?: object | string | boolean;
  onLoadWallet?: () => void;
  loadWalletLoading?: boolean;
  loadWalletError?: object | string | boolean;
}

export class HomePage extends React.PureComponent<HomePageProps> { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // SAFETY: onLoadWallet is always provided by mapDispatchToProps below.
    (this.props.onLoadWallet as () => void)();
  }

  render() {
    const {
      onGenerateWallet,
      onGenerateWalletCancel,
      isShowGenerateWallet,
      generateWalletLoading,
      generateWalletError,

      generateKeystoreLoading,
      generateKeystoreError,
      seed,
      password,
      restoreWalletError,
      onGenerateKeystore,
      onGenerateAddress,
      onCheckBalances,
      isComfirmed,
      // addressList,
      addressMap,
      tokenDecimalsMap,

      onShowRestoreWallet,
      isShowRestoreWallet,
      userSeed,
      userPassword,
      onChangeUserSeed,
      onChangeUserPassword,
      onRestoreWalletFromSeed,
      onRestoreWalletCancel,

      isShowSendToken,
      onShowSendToken,
      onHideSendToken,
      onShowTokenChooser,
      onHideTokenChooser,

      isShowTokenChooser,

      addressListLoading,
      addressListError,
      addressListMsg,

      networkReady,
      checkingBalanceDoneTime,
      checkingBalances,
      checkingBalancesError,

      onLockWallet,
      onUnlockWallet,

      exchangeRates,
      onSelectCurrency,
      convertTo,

      onGetExchangeRates,
      getExchangeRatesDoneTime,
      getExchangeRatesLoading,
      getExchangeRatesError,
      onCloseWallet,

      onSaveWallet,
      saveWalletLoading,
      saveWalletError,
      onLoadWallet,
      loadWalletLoading,
      loadWalletError,
    } = this.props;

    const subHeaderProps = {
      onGenerateWallet,
      onShowRestoreWallet,
      isComfirmed,
      onCloseWallet,
      onLockWallet,
      password,
      onUnlockWallet,

      onSaveWallet,
      saveWalletLoading,
      saveWalletError,
      onLoadWallet,
      loadWalletLoading,
      loadWalletError,
    };

    const generateWalletProps = {
      isShowGenerateWallet,
      generateWalletLoading,
      generateWalletError,

      seed,
      password,

      onGenerateWallet,
      onGenerateWalletCancel,
      onGenerateKeystore,
    };
    const restoreWalletModalProps = {
      isShowRestoreWallet,
      userSeed,
      userPassword,
      restoreWalletError,
      onChangeUserSeed,
      onChangeUserPassword,
      onRestoreWalletCancel,
      onRestoreWalletFromSeed,
    };

    const addressViewProps = {
      generateKeystoreLoading,
      generateKeystoreError,
      isComfirmed,
      // addressList,
      addressMap,
      tokenDecimalsMap,

      onShowSendToken,
      onShowTokenChooser,

      onCheckBalances,
      onGenerateAddress,
      addressListLoading,
      addressListError,
      addressListMsg,
      networkReady,
      checkingBalanceDoneTime,
      checkingBalances,
      checkingBalancesError,
      onSelectCurrency,
      exchangeRates,
      convertTo,
      onGetExchangeRates,
      getExchangeRatesDoneTime,
      getExchangeRatesLoading,
      getExchangeRatesError,
    };

    const sendTokenProps = { isShowSendToken, onHideSendToken };
    const tokenChooserProps = { isShowTokenChooser, onHideTokenChooser };

    return (
      <div>
        <Content>
          <Header />
          <SubHeader {...subHeaderProps} />
          <GenerateWalletModal {...generateWalletProps} />
          <RestoreWalletModal {...restoreWalletModalProps} />
          <AddressView {...addressViewProps} />
          <SendToken {...sendTokenProps} />
          <TokenChooser {...tokenChooserProps} />
        </Content>
        <PageFooter />
      </div>
    );
  }
}

(HomePage as any).propTypes = { // eslint-disable-line @typescript-eslint/no-explicit-any
  onGenerateWallet: PropTypes.func,
  onGenerateWalletCancel: PropTypes.func,
  isShowGenerateWallet: PropTypes.bool,
  generateWalletLoading: PropTypes.bool,
  generateWalletError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  seed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),

  generateKeystoreLoading: PropTypes.bool,
  generateKeystoreError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),

  // onInitSeed: PropTypes.func,
  onGenerateKeystore: PropTypes.func,
  onGenerateAddress: PropTypes.func,
  onShowRestoreWallet: PropTypes.func,

  isShowRestoreWallet: PropTypes.bool,
  userSeed: PropTypes.string,
  userPassword: PropTypes.string,
  onChangeUserSeed: PropTypes.func,
  onChangeUserPassword: PropTypes.func,
  restoreWalletError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  onRestoreWalletFromSeed: PropTypes.func,
  onRestoreWalletCancel: PropTypes.func,

  onCheckBalances: PropTypes.func,

  onLockWallet: PropTypes.func,
  onUnlockWallet: PropTypes.func,

  isComfirmed: PropTypes.bool,
  addressMap: PropTypes.oneOfType([
    // PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
  tokenDecimalsMap: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),

  isShowSendToken: PropTypes.bool,
  onShowSendToken: PropTypes.func,
  onHideSendToken: PropTypes.func,

  isShowTokenChooser: PropTypes.bool,
  onShowTokenChooser: PropTypes.func,
  onHideTokenChooser: PropTypes.func,

  addressListLoading: PropTypes.bool,
  addressListError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  addressListMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

  networkReady: PropTypes.bool,
  checkingBalanceDoneTime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  checkingBalances: PropTypes.bool,
  checkingBalancesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),

  exchangeRates: PropTypes.object,
  onSelectCurrency: PropTypes.func,
  convertTo: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onGetExchangeRates: PropTypes.func,
  getExchangeRatesDoneTime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  getExchangeRatesLoading: PropTypes.bool,
  getExchangeRatesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  onCloseWallet: PropTypes.func,

  onSaveWallet: PropTypes.func,
  saveWalletLoading: PropTypes.bool,
  saveWalletError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  onLoadWallet: PropTypes.func,
  loadWalletLoading: PropTypes.bool,
  loadWalletError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
};

export function mapDispatchToProps(dispatch: (action: { type: string }) => void) {
  return {
    onGenerateWallet: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(generateWallet());
    },
    onGenerateWalletCancel: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(generateWalletCancel());
    },
    onGenerateKeystore: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(generateKeystore());
    },
    onGenerateAddress: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(generateAddress());
    },
    onLoadNetwork: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadNetwork('local'));
    },
    onShowRestoreWallet: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(showRestoreWallet());
    },
    onRestoreWalletCancel: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(restoreWalletCancel());
    },
    onChangeUserSeed: (evt: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // console.log(evt.target);
      // SAFETY: input change events always carry a target with a value.
      dispatch(changeUserSeed((evt.target as { value: string }).value));
    },
    onChangeUserPassword: (evt: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // console.log(evt.target);
      // SAFETY: input change events always carry a target with a value.
      dispatch(changeUserPassword((evt.target as { value: string }).value));
    },
    onRestoreWalletFromSeed: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(restoreWalletFromSeed());
    },
    onCheckBalances: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(checkBalances());
    },
    onShowSendToken: (address: string, tokenSymbol?: string) => {
      dispatch(showSendToken(address, tokenSymbol));
    },
    onHideSendToken: () => {
      dispatch(hideSendToken());
    },
    onShowTokenChooser: () => {
      dispatch(showTokenChooser());
    },
    onHideTokenChooser: () => {
      dispatch(hideTokenChooser());
    },
    onLockWallet: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(lockWallet());
    },
    onUnlockWallet: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(unlockWallet());
    },
    onSelectCurrency: (convertTo: string) => {
      // if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(selectCurrency(convertTo));
    },
    onGetExchangeRates: () => {
      // if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(getExchangeRates());
    },
    onCloseWallet: () => {
      dispatch(closeWallet());
    },
    onSaveWallet: () => {
      dispatch(saveWallet());
    },
    onLoadWallet: () => {
      dispatch(loadWallet());
    },
  };
}

// SAFETY: createStructuredSelector's reselect 3 typings infer the store state
// as `unknown` while the selectors key off ImmutableState; the app state is an
// Immutable.Map, so the cast only re-aligns the inferred state parameter.
const mapStateToProps = createStructuredSelector({
  isShowGenerateWallet: makeSelectIsShowGenerateWallet(),
  generateWalletLoading: makeSelectGenerateWalletLoading(),
  generateWalletError: makeSelectGenerateWalletError(),
  seed: makeSelectSeed(),
  password: makeSelectPassword(),

  generateKeystoreLoading: makeSelectGenerateKeystoreLoading(),
  generateKeystoreError: makeSelectGenerateKeystoreError(),
  restoreWalletError: makeSelectRestoreWalletError(),
  isComfirmed: makeSelectIsComfirmed(),
  // addressList: makeSelectAddressList(),
  addressMap: makeSelectAddressMap(),
  tokenDecimalsMap: makeSelectTokenDecimalsMap(),
  // keystore: makeSelectKeystore(),
  isShowRestoreWallet: makeSelectShowRestoreWallet(),
  userSeed: makeSelectUserSeed(),
  userPassword: makeSelectUserPassword(),

  isShowSendToken: makeSelectIsShowSendToken(),
  isShowTokenChooser: makeSelectIsShowTokenChooser(),

  addressListLoading: makeSelectAddressListLoading(),
  addressListError: makeSelectAddressListError(),
  addressListMsg: makeSelectAddressListMsg(),

  networkReady: makeSelectNetworkReady(),
  checkingBalanceDoneTime: makeSelectCheckingBalanceDoneTime(),
  checkingBalances: makeSelectCheckingBalances(),
  checkingBalancesError: makeSelectCheckingBalancesError(),

  // exchangeRates: makeSelectExchangeRates(),
  exchangeRates: makeSelectExchangeRates(),
  convertTo: makeSelectConvertTo(),

  getExchangeRatesDoneTime: makeSelectGetExchangeRatesDoneTime(),
  getExchangeRatesLoading: makeSelectGetExchangeRatesLoading(),
  getExchangeRatesError: makeSelectGetExchangeRatesError(),

  saveWalletLoading: makeSelectSaveWalletLoading(),
  saveWalletError: makeSelectSaveWalletError(),
  loadWalletLoading: makeSelectLoadWalletLoading(),
  loadWalletError: makeSelectLoadwalletError(),
} as any) as (state: unknown) => Record<string, unknown>;

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// SAFETY: the reducer keys its action by a concrete union while injectReducer
// accepts (state: unknown, action: unknown); redux dispatches are dynamically
// typed at runtime, so the cast only widens the parameter types.
const withReducer = injectReducer({ key: 'home', reducer: reducer as (state: unknown, action: unknown) => unknown });
const withSaga = injectSaga({ key: 'home', saga });

// SAFETY: redux 3 `compose` typings don't track these higher-order component
// signatures (react-redux is untyped); the runtime composition is unchanged.
const enhanced = (compose(
  withReducer,
  withSaga,
  withConnect,
) as (component: React.ComponentType<any>) => React.ComponentType<any>)(HomePage);

export default enhanced;
