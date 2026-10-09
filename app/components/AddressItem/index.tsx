/**
*
* AddressItem
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
import { Ether } from 'utils/constants';
// import messages from './messages';

// Plain-JS per-token data for one address ({ balance: BigNumber | false }).
interface TokenEntry {
  balance?: any;
}

interface AddressItemProps {
  address?: string;
  data?: Record<string, TokenEntry>; // plain object: token symbol -> data
  onChangeFrom: (address: string) => void;
  exchangeRates?: Record<string, any>; // plain object: pair -> { name, rate }
  convertTo?: string | boolean;
}

function AddressItem(props: AddressItemProps) {
  const { address, data, onChangeFrom, exchangeRates, convertTo } = props;
  // SAFETY: data/exchangeRates are optional in the props type but always
  // provided by AddressList (the only caller); the old Immutable .get() would
  // have thrown on a missing Map the same way this member access does.
  const ethData = data!.eth;

  const balance = ethData.balance !== false ? `${ethData.balance.div(Ether).toString(10)} ETH ` : 'n/a';

  const rateInfo = (exchangeRates as any)[convertTo as string];
  const rate = rateInfo && rateInfo.rate;
  const convertedBalance = (balance !== 'n/a' && rate) ? ethData.balance.div(Ether).times(rate).toFixed(2).toString(10) : '';
  const convertToName = rateInfo && rateInfo.name;

  // SAFETY: AddressItem is only rendered by AddressList as
  // Object.entries(addressList).map(...), so `address` is always a defined
  // object key; the cast only narrows the optional prop.
  const fromAddress = address as string;

  return (
    <div>
      {address} |
      Balance: {balance}
      {convertedBalance} {convertToName}
      <button onClick={() => onChangeFrom(fromAddress)}>
        Send
      </button>
    </div>
  );
}

(AddressItem as any).propTypes = {
  address: PropTypes.string,
  data: PropTypes.object,
  onChangeFrom: PropTypes.func,
  exchangeRates: PropTypes.object,
  convertTo: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddressItem;
