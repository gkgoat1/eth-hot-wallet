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
    return <div> {checkingBalancesError} </div>;
  }

  const balanceCheckString = checkingBalanceDoneTime ? `balances checked on  + ${checkingBalanceDoneTime}` : 'Balances wasnt checked yet';
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
