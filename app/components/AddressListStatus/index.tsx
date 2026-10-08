/**
*
* AddressListStatus
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

interface AddressListStatusProps {
  addressListLoading?: boolean;
  addressListError?: object | string | boolean;
  addressListMsg?: string | boolean;
}

function AddressListStatus({ addressListLoading, addressListError, addressListMsg }: AddressListStatusProps) {
  if (addressListLoading) {
    return <div> addressListLoading ....</div>;
  }

  if (addressListError !== false) {
    return <div> {addressListError} </div>;
  }

  if (addressListMsg) {
    return (
      <div>
        {addressListMsg}
      </div>
    );
  }
  return null;
}

(AddressListStatus as any).propTypes = {
  addressListLoading: PropTypes.bool,
  addressListError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
  addressListMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddressListStatus;
