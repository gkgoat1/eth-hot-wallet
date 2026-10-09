/**
*
* AddressTableFooter
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IconButton from 'components/IconButton';

const Div = styled.div`
  margin-top: 14px;
  .ant-btn {
    margin-right: 5px;
    margin-top: 15px;
  }
`;

// SAFETY: styled-components v2's bundled typings resolve against @types/react
// 19 in this pnpm layout while app code resolves @types/react 15, so styled
// tags fail the React 15 JSX checker. Runtime behavior is unchanged; the cast
// only re-exposes the styled tag as a JSX component.
const DivAny = Div as any;


interface AddressTableFooterProps {
  checkingBalancesError?: object | string | boolean;
  checkingBalances?: boolean;
  onCheckBalances: () => void;
  networkReady?: boolean;

  isComfirmed?: boolean;
  onGenerateAddress: () => void;
  addressListLoading?: boolean;
  addressListError?: object | string | boolean;

  onGetExchangeRates: () => void;
  getExchangeRatesLoading?: boolean;
  getExchangeRatesError?: object | string | boolean;

  onShowTokenChooser: () => void;
}

function AddressTableFooter(props: AddressTableFooterProps) {
  const {
    checkingBalancesError,
    checkingBalances,
    onCheckBalances,
    networkReady,

    isComfirmed,
    onGenerateAddress,
    addressListLoading,
    addressListError,

    onGetExchangeRates,
    getExchangeRatesLoading,
    getExchangeRatesError,

    onShowTokenChooser,
  } = props;

  return (
    <DivAny>
      <IconButton
        text="Add address"
        icon="plus"
        onClick={onGenerateAddress}
        loading={addressListLoading}
        error={addressListError}
        disabled={!isComfirmed}
        popconfirmMsg={false}
      />
      <IconButton
        text="Check balances"
        icon="reload"
        onClick={onCheckBalances}
        loading={checkingBalances}
        error={checkingBalancesError}
        disabled={!networkReady}
        popconfirmMsg="Refresh balance?"
      />
      <IconButton
        text="Update rates"
        icon="global"
        onClick={onGetExchangeRates}
        loading={getExchangeRatesLoading}
        error={getExchangeRatesError}
        disabled={!networkReady}
        popconfirmMsg="Refresh exchange rates?"
      />
      <br />
      <IconButton
        text="Select Tokens"
        icon="bars"
        onClick={onShowTokenChooser}
        type="primary"
        // onClick, loading, error, disabled, popconfirmMsg
      />
      <br /><br />
    </DivAny>
  );
}

(AddressTableFooter as any).propTypes = {
  onCheckBalances: PropTypes.func,
  networkReady: PropTypes.bool,
  checkingBalances: PropTypes.bool,
  checkingBalancesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),

  isComfirmed: PropTypes.bool,
  onGenerateAddress: PropTypes.func,
  addressListLoading: PropTypes.bool,
  addressListError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),

  onGetExchangeRates: PropTypes.func,
  getExchangeRatesLoading: PropTypes.bool,
  getExchangeRatesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  onShowTokenChooser: PropTypes.func,
};

export default AddressTableFooter;
