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

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime component is unchanged; this alias only re-types
// it.
const InputNumberAny = InputNumber as any;

function SendAmount({ amount, onChangeAmount, locked }: SendAmountProps) {
  return (
    <span>
      {'Amount: '}
      <InputNumberAny
        value={amount}
        min={0}
        step={0.1}
        onChange={(value: number | undefined) => {
          if (onChangeAmount) {
            // SAFETY: antd 3 InputNumber's onChange is typed
            // `number | undefined`; at runtime it only fires with a numeric
            // value here (min/step constrain input), so the value passed to
            // the handler is a number.
            onChangeAmount(value as number);
          }
        }}
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
