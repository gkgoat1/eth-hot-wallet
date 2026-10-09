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

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const PopconfirmAny = Popconfirm as any;
const ButtonAny = Button as any;

function LockButton(props: LockButtonProps) {
  const { onLockWallet, password, onUnlockWallet } = props;

  if (password) {
    return (
      <PopconfirmAny key="close_wallet" placement="bottom" title="Comfirm locking wallet" onConfirm={onLockWallet} okText="Confirm" cancelText="Abort">
        <ButtonAny icon="lock" type="default" size="large" >
          Lock Wallet
        </ButtonAny>
      </PopconfirmAny>
    );
  }

  return (
    <ButtonAny icon="unlock" type="default" size="large" onClick={onUnlockWallet}>
      Unlock Wallet
    </ButtonAny>
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
