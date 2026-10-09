/**
*
* SendConfirmationView
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Spin } from 'antd';
import styled from 'styled-components';

// SAFETY: antd 3's bundled types resolve against @types/react 19 in this
// pnpm layout while app code resolves @types/react 15, so every antd class
// component fails JSX validation with spurious errors. At runtime these are
// ordinary React 15-compatible components; the casts only re-expose them to
// the React 15 JSX checker.
const AlertAny = Alert as any;
const ButtonAny = Button as any;
const SpinAny = Spin as any;

const Div = styled.div`
  margin-top: 22px;
`;
// SAFETY: styled-components v2 has no bundled types; the installed
// @types/styled-components resolves against @types/react 19, so styled tags
// fail the React 15 JSX checker. Runtime behavior is unchanged.
const DivAny = Div as any;

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

interface SendConfirmationViewProps {
  comfirmationLoading?: boolean | string;
  confirmationError?: boolean | string;
  confirmationMsg?: boolean | string;
  isSendComfirmationLocked?: boolean;

  onSendTransaction: (evt?: any) => void;
  onAbortTransaction: (evt?: any) => void;

  sendError?: boolean | string;
}

function SendConfirmationView(props: SendConfirmationViewProps) {
  const {
    comfirmationLoading,
    confirmationError,
    confirmationMsg,
    onSendTransaction,
    onAbortTransaction,
    isSendComfirmationLocked,
    sendError,
       } = props;
  if (comfirmationLoading) {
    return (
      <DivAny>
        <SpinAny
          spinning
          style={{ position: 'static' }}
          size="large"
          tip="checking transaction...."
        >
          <br />
        </SpinAny>
      </DivAny>
    );
  }

  if (confirmationError !== false) {
    return (
      <DivAny>
        <AlertAny
          message="Transaction not created"
          description={confirmationError}
          type="error"
          showIcon
        />
      </DivAny>
    );
  }

  if (confirmationMsg !== false) {
    return (
      <DivAny>
        <AlertAny
          message="Transaction is valid"
          description={confirmationMsg}
          type="info"
        />
        <br />
        <ButtonAny icon="to-top" onClick={onSendTransaction} disabled={isSendComfirmationLocked} >
          {sendError ? 'Try again' : 'Send ETH'}
        </ButtonAny>
        {' '}
        <ButtonAny icon="close" onClick={onAbortTransaction} disabled={isSendComfirmationLocked} >
          Back
        </ButtonAny>
      </DivAny>
    );
  }

  return (
    null
  );
}

(SendConfirmationView as any).propTypes = {
  comfirmationLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  confirmationError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  confirmationMsg: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isSendComfirmationLocked: PropTypes.bool,

  onSendTransaction: PropTypes.func.isRequired,
  onAbortTransaction: PropTypes.func.isRequired,

  sendError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default SendConfirmationView;
