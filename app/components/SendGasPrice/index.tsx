/**
*
* SendGasPrice
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Slider, InputNumber, Row, Col } from 'antd';

// SAFETY: antd 3's bundled types resolve against @types/react 19 in this
// pnpm layout while app code resolves @types/react 15, so every antd class
// component fails JSX validation with spurious errors. At runtime these are
// ordinary React 15-compatible components; the casts only re-expose them to
// the React 15 JSX checker.
const SliderAny = Slider as any;
const InputNumberAny = InputNumber as any;
const RowAny = Row as any;
const ColAny = Col as any;
// import { Gwei } from 'utils/constants';
// import BigNumber from 'bignumber.js';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

interface SendGasPriceProps {
  onChangeGasPrice: (value: number) => void;
  locked?: boolean;
  gasPrice?: number;
}

function SendGasPrice({ gasPrice, onChangeGasPrice, locked }: SendGasPriceProps) {
  return (
    <div>
      {'Gas price (Gwei):'}
      <RowAny type="flex" justify="center">
        <ColAny span={12}>
          <SliderAny
            min={0.5}
            max={100}
            step={0.1}
            onChange={onChangeGasPrice} // Bignumber created by reducer
            value={gasPrice}
            disabled={locked}
          />
        </ColAny>
        <ColAny span={4}>
          <InputNumberAny
            min={0.5}
            max={100}
            step={0.1}
            style={{ marginLeft: 16 }}
            value={gasPrice}
            onChange={onChangeGasPrice} // Bignumber created by reducer
            disabled={locked}
          />
        </ColAny>
      </RowAny>
    </div>
  );
}

(SendGasPrice as any).propTypes = {
  onChangeGasPrice: PropTypes.func.isRequired,
  locked: PropTypes.bool,
  gasPrice: PropTypes.number,
};

export default SendGasPrice;
