/**
*
* CheckBalanceStatus
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

interface CheckBalancesStatusProps {
  checkingBalanceDoneTime?: string | boolean;
  checkingBalances?: boolean;
  checkingBalancesError?: object | string | boolean;
}

function CheckBalancesStatus({ checkingBalanceDoneTime, checkingBalances, checkingBalancesError }: CheckBalancesStatusProps) {
  // console.log(checkingBalancesError);
  if (checkingBalances) {
    return <div> checkingBalances ....</div>;
  }

  if (checkingBalancesError !== false) {
    // React 18 types: a bare object isn't a valid ReactNode; render objects as
    // JSON (errors here are message strings or Error-ish objects).
    const errorText =
      typeof checkingBalancesError === 'object'
        ? JSON.stringify(checkingBalancesError)
        : checkingBalancesError;
    return <div> {errorText} </div>;
  }

  // Regression fix (plan §9a): dropped a literal ' + ' left over from a
  // string-concat -> template-literal migration (rendered "checked on  + …").
  const balanceCheckString = checkingBalanceDoneTime ? `balances checked on ${checkingBalanceDoneTime}` : 'Balances wasnt checked yet';
  return (
    <div>
      {balanceCheckString}
    </div>
  );
}

(CheckBalancesStatus as any).propTypes = {
  checkingBalanceDoneTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  checkingBalances: PropTypes.bool,
  checkingBalancesError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default CheckBalancesStatus;
