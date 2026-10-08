/**
*
* SendTokenView
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import SendToken from 'containers/SendToken/Loadable';


// required to async load the SendToken container once and keeping it
let loadedSendToken = false;

interface SendTokenViewProps {
  isShowSendToken?: boolean;
}

function SendTokenView(props: SendTokenViewProps) {
  const {
    isShowSendToken,
  } = props;
  loadedSendToken = isShowSendToken || loadedSendToken;

  if (loadedSendToken) {
    return (
      <SendToken {...props} />
    );
  }
  return null;
}

(SendTokenView as any).propTypes = {
  isShowSendToken: PropTypes.bool,
  // onHideSendToken: PropTypes.func,
};

export default SendTokenView;
