/**
*
* AddressView
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Alert } from 'antd';
import styled from 'styled-components';

import AddressTable from 'components/AddressTable';
// import AddressListStatus from 'components/AddressListStatus';
// import CheckBalancesStatus from 'components/CheckBalancesStatus';
import AddressTableFooter from 'components/AddressTableFooter';
import WelcomeText from 'components/WelcomeText';

const Div = styled.div`
  padding: 30px 5px 20px 10px;
  min-height: 100px;
`;

// SAFETY: antd 3 / styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const DivAny = Div as any;
const SpinAny = Spin as any;
const AlertAny = Alert as any;

// plain JS object: address -> per-token data
interface AddressMap {
  [address: string]: any;
}

// plain JS object: number of decimals per token symbol
interface TokenDecimalsMap {
  [token: string]: number;
}

// plain JS object: exchange rates keyed by currency pair (ie 'eth_usd')
interface ExchangeRates {
  [pair: string]: any;
}

interface AddressViewProps {
  generateKeystoreLoading?: boolean;
  generateKeystoreError?: object | string | boolean;
  isComfirmed?: boolean;
  addressMap?: AddressMap | boolean;
  tokenDecimalsMap?: boolean | TokenDecimalsMap;
  onShowSendToken: (address: string, token: string) => void;
  onShowTokenChooser: () => void;

  onGenerateAddress: () => void;
  addressListLoading?: boolean;
  addressListError?: object | string | boolean;
  addressListMsg?: string | boolean;

  onCheckBalances: () => void;
  networkReady?: boolean;
  checkingBalanceDoneTime?: string | boolean;
  checkingBalances?: boolean;
  checkingBalancesError?: object | string | boolean;

  exchangeRates?: ExchangeRates;
  onSelectCurrency: (convertTo: string) => void;
  convertTo?: string | boolean;

  onGetExchangeRates: () => void;
  getExchangeRatesDoneTime?: string | boolean;
  getExchangeRatesLoading?: boolean;
  getExchangeRatesError?: object | string | boolean;
}

function AddressView(props: AddressViewProps) {
  const {
    generateKeystoreLoading, generateKeystoreError,
    isComfirmed,
    addressMap, tokenDecimalsMap,
    onShowSendToken, onCheckBalances,
    onGenerateAddress,
    networkReady, checkingBalanceDoneTime, checkingBalances, checkingBalancesError,
    addressListLoading, addressListError, addressListMsg,
    exchangeRates, onSelectCurrency, convertTo,
    onGetExchangeRates,
    getExchangeRatesDoneTime, getExchangeRatesLoading, getExchangeRatesError,
    onShowTokenChooser,
   } = props;

  const addressTableProps = {
    addressMap,
    tokenDecimalsMap,
    onShowSendToken,
    exchangeRates,
    onSelectCurrency,
    convertTo,
  };

  const addressTableFooterProps = {
    checkingBalanceDoneTime,
    checkingBalances,
    checkingBalancesError,
    onCheckBalances,
    networkReady,

    isComfirmed,
    onGenerateAddress,
    addressListLoading,
    addressListError,
    addressListMsg,

    onGetExchangeRates,
    getExchangeRatesDoneTime,
    getExchangeRatesLoading,
    getExchangeRatesError,

    onShowTokenChooser,
  };

  // SAFETY: antd 3's `description` is typed ReactNode against
  // @types/react@19, which React 15 string props do not satisfy. The value is
  // always a renderable error string at runtime; the alias only re-types it.
  const keystoreErrorDescription = generateKeystoreError as any;

  let addressViewContent = (
    <DivAny>
      {generateKeystoreError ?
        <AlertAny
          message="Generate Keystore Error"
          description={keystoreErrorDescription}
          type="error"
          showIcon
        />
        :
        <WelcomeText />}
    </DivAny>
  );

  if (isComfirmed) {
    addressViewContent = (
      <DivAny>
        <AddressTable {...addressTableProps} />
        <AddressTableFooter {...addressTableFooterProps} />
      </DivAny>
    );
  }

  return (
    <SpinAny
      spinning={generateKeystoreLoading}
      style={{ position: 'static' }}
      size="large"
      tip="Loading..."
    >
      {addressViewContent}
    </SpinAny>
  );
}

(AddressView as any).propTypes = {
  generateKeystoreLoading: PropTypes.bool,
  generateKeystoreError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  isComfirmed: PropTypes.bool,
  addressMap: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.array,
  ]),
  tokenDecimalsMap: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onShowSendToken: PropTypes.func,
  onShowTokenChooser: PropTypes.func,

  onGenerateAddress: PropTypes.func,
  addressListLoading: PropTypes.bool,
  addressListError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  addressListMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

  onCheckBalances: PropTypes.func,
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
};

export default AddressView;
