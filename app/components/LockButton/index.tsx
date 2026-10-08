/**
*
* LockButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

interface LockButtonProps {
  onLockWallet?: () => void;
  password?: string | boolean;
  onUnlockWallet?: () => void;
}

function LockButton(props: LockButtonProps) {
  const { onLockWallet, password, onUnlockWallet } = props;

  if (password) {
    return (
      <Popconfirm key="close_wallet" placement="bottom" title="Comfirm locking wallet" onConfirm={onLockWallet} okText="Confirm" cancelText="Abort">
        <Button icon="lock" type="default" size="large" >
          Lock Wallet
        </Button>
      </Popconfirm>
    );
  }

  return (
    <Button icon="unlock" type="default" size="large" onClick={onUnlockWallet}>
      Unlock Wallet
    </Button>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(LockButton as any).propTypes = {
  onLockWallet: PropTypes.func,
  password: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onUnlockWallet: PropTypes.func,
};

export default LockButton;
