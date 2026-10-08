/**
*
* SendFrom
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;

// import styled from 'styled-components';

interface SendFromProps {
  from?: string | boolean;
  onChangeFrom?: (address: string) => void;
  addressList?: any; // immutable Map of address -> data, or false
  locked?: boolean;
}

function SendFrom({ addressList, from, onChangeFrom, locked }: SendFromProps) {
  // let options;
  let selectOptions;
  if (addressList && addressList.keySeq().toArray()) {
    // console.log(addressList.keySeq().toArray());

    /* options = addressList.keySeq().toArray().map((address) =>
      <option value={address} key={address}>{address}</option>
    ); */
    selectOptions = addressList.keySeq().toArray().map((address) =>
      <Option value={address} key={address}>{address}</Option>
    );
  }

  return (
    <div>
      Source:<br />
      <Select value={from} style={{ width: 300 }} onChange={onChangeFrom} disabled={locked}>
        {selectOptions}
      </Select>
    </div >
  );
}

(SendFrom as any).propTypes = {
  from: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onChangeFrom: PropTypes.func,
  addressList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    // PropTypes.array,
  ]),
  locked: PropTypes.bool,
};

export default SendFrom;
