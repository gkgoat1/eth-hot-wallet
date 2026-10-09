/**
*
* SendTokenSymbol
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
// SAFETY: antd 3's bundled types resolve against @types/react 19 in this
// pnpm layout while app code resolves @types/react 15, so every antd class
// component fails JSX validation with spurious errors. At runtime these are
// ordinary React 15-compatible components; the casts only re-expose them to
// the React 15 JSX checker.
const SelectAny = Select as any;
const Option = SelectAny.Option;
// import styled from 'styled-components';


interface SendTokenSymbolProps {
  sendTokenSymbol?: string;
  tokenInfoList?: string[];
  onChangeFrom?: (event: React.SyntheticEvent<HTMLElement> | null, tokenSymbol: string) => void;
  locked?: boolean;
}

function SendTokenSymbol(props: SendTokenSymbolProps) {
  const { sendTokenSymbol, tokenInfoList = [], onChangeFrom = () => undefined, locked } = props;

  const optionsList = tokenInfoList.map((token) =>
    <Option key={token} value={token}>{token.toUpperCase()}</Option>
  );

  return (
    <span>
      {' Token: '}
      <SelectAny
        value={sendTokenSymbol}
        style={{ width: 85 }}
        onChange={(tokenSymbol: string) => onChangeFrom(null, tokenSymbol)}
        disabled={tokenInfoList.length === 1 || locked}
      >
        {optionsList}
      </SelectAny >
    </span>
  );
}

(SendTokenSymbol as any).propTypes = {
  sendTokenSymbol: PropTypes.string,
  tokenInfoList: PropTypes.array,
  onChangeFrom: PropTypes.func,
  locked: PropTypes.bool,
};

export default SendTokenSymbol;
