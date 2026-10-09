/**
*
* SendFrom
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
const Option = Select.Option;

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const SelectAny = Select as any;
const OptionAny = Option as any;

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
    selectOptions = addressList.keySeq().toArray().map((address: string) =>
      <OptionAny value={address} key={address}>{address}</OptionAny>
    );
  }

  return (
    <div>
      Source:<br />
      <SelectAny value={from} style={{ width: 300 }} onChange={onChangeFrom} disabled={locked}>
        {selectOptions}
      </SelectAny>
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
