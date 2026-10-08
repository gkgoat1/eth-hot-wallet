/**
*
* SendAmount
*
*/

import React from 'react';
// import styled from 'styled-components';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

interface SendAmountProps {
  amount?: number;
  onChangeAmount?: (value: number) => void;
  locked?: boolean;
}

function SendAmount({ amount, onChangeAmount, locked }: SendAmountProps) {
  return (
    <span>
      {'Amount: '}
      <InputNumber
        value={amount}
        min={0}
        step={0.1}
        onChange={(value) => onChangeAmount((value))}
        disabled={locked}
      />
    </span>
  );
}

(SendAmount as any).propTypes = {
  amount: PropTypes.number,
  onChangeAmount: PropTypes.func,
  locked: PropTypes.bool,
};

export default SendAmount;
