/**
*
* AddressList
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import AddressItem from 'components/AddressItem';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

interface AddressListProps {
  addressList?: any; // immutable Map of address -> data, or false
  onChangeFrom: (address: string) => void;
  exchangeRates?: any; // immutable Map
  convertTo?: string | boolean;
}

function AddressList({ addressList, onChangeFrom, exchangeRates, convertTo }: AddressListProps) {
  let mainList = null;
  // console.log(addressList.toJS().map(([address, data]) => (data)));
  // const listObject = addressList.toJS();
  if (addressList) {
    // addressList is an Immutable.Map of address string -> token data map.
    mainList = addressList.entrySeq().map(([address, data]: [string, any]) => (
      // if (key ==='lastIndex') return null;
      <AddressItem
        key={`item-${address}`}
        address={address}
        data={data}
        onChangeFrom={onChangeFrom}
        exchangeRates={exchangeRates}
        convertTo={convertTo}
      />
    ));
  }

  return (
    <div>
      {mainList}
      <br />
    </div>
  );
}

(AddressList as any).propTypes = {
  addressList: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onChangeFrom: PropTypes.func,
  exchangeRates: PropTypes.object,
  convertTo: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddressList;
