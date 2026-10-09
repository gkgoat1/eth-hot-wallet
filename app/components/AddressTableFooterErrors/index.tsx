/**
*
* AddressTableFooterErrors
*
*/

import React from 'react';
import styled from 'styled-components';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

const Div = styled.div`
  max-width: 490px;  
  margin: auto;
  margin-top: 35px;
`;
const PaddedAlert = styled(Alert)`
  margin-top: 15px;
`;

// SAFETY: antd 3 / styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const DivAny = Div as any;
const AlertAny = Alert as any;
const PaddedAlertAny = PaddedAlert as any;
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

interface AddressTableFooterErrorsProps {
  checkingBalancesError?: object | string | boolean;
  addressListError?: object | string | boolean;
  getExchangeRatesError?: object | string | boolean;
}

function AddressTableFooterErrors(props: AddressTableFooterErrorsProps) {
  const { checkingBalancesError, addressListError, getExchangeRatesError } = props;
  // SAFETY: antd 3's `description` is typed ReactNode against
  // @types/react@19, which React 15-era union types do not satisfy. These
  // values are always renderable error strings at runtime; the aliases only
  // re-type them.
  const checkingBalancesErrorDesc = checkingBalancesError as any;
  const addressListErrorDesc = addressListError as any;
  return (
    <DivAny>
      {checkingBalancesError ? <AlertAny type="error" message="Check Balances Error" description={checkingBalancesErrorDesc} /> : null}
      {addressListError ? <PaddedAlertAny type="error" message="Add Addresss Error" description={addressListErrorDesc} /> : null}
      {getExchangeRatesError ? <PaddedAlertAny type="error" message="Update Exchange Rates Error" description={getExchangeRatesError.toString()} /> : null}
    </DivAny>
  );
}

(AddressTableFooterErrors as any).propTypes = {
  checkingBalancesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  addressListError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  getExchangeRatesError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
};

export default AddressTableFooterErrors;
