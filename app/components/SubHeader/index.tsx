/**
*
* SubHeader
*
*/

import React from 'react';
import { Button, Popconfirm } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LockButton from 'components/LockButton';
import IconButton from 'components/IconButton';
const Div = styled.div`
  margin-top: 45px;
  .ant-btn {
  margin-right: 8px;
  margin-bottom: 12px;
  }

  .anticon-lock {
    color: red;
  }
  .anticon-unlock {
    color: blue;
  }
`;

// SAFETY: antd 3 / styled-components v2 typings resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type fails the app's React 15
// JSX checker. The runtime components are unchanged; these aliases only
// re-type them.
const DivAny = Div as any;
const ButtonAny = Button as any;
const PopconfirmAny = Popconfirm as any;

interface SubHeaderProps {
  onGenerateWallet?: () => void;
  onShowRestoreWallet?: () => void;
  isComfirmed?: boolean;
  onCloseWallet?: () => void;
  onLockWallet?: () => void;
  password?: string | boolean;
  onUnlockWallet?: () => void;
}

function SubHeader(props: SubHeaderProps) {
  const {
    onGenerateWallet, onShowRestoreWallet, isComfirmed, onCloseWallet,
    onLockWallet, password, onUnlockWallet,
    /* optional laod / save buttons
     onSaveWallet, saveWalletLoading, saveWalletError,
     onLoadWallet, loadWalletLoading, loadWalletError, */
  } = props;

  const lockButtonProps = { onLockWallet, password, onUnlockWallet };

  const noWalletSubHeader = [
    <ButtonAny key="new_wallet" type="primary" size="large" onClick={onGenerateWallet}>
      New wallet
    </ButtonAny>,
    <ButtonAny key="restore_wallet" type="default" size="large" onClick={onShowRestoreWallet}>
      Restore wallet
    </ButtonAny>,
    /* optional laod / save buttons
     <IconButton
      key="load"
      text="Load from storage"
      icon="upload"
      onClick={onLoadWallet}
      loading={loadWalletLoading}
      error={loadWalletError}
    />,*/
  ];

  const existingWalletSubHeader = [
    <LockButton key="lock_button" {...lockButtonProps} />,
    <PopconfirmAny key="close_wallet" placement="bottom" title="Wallet will be deleted from memory and LocalStorage" onConfirm={onCloseWallet} okText="Confirm" cancelText="Abort">
      <ButtonAny key="close_wallet" type="default" icon="close-square-o" size="large">
        Close wallet
      </ButtonAny>
    </PopconfirmAny>,
    /* optional laod / save buttons
    <IconButton
      key="save"
      text="Save to disk"
      icon="download"
      onClick={onSaveWallet}
      loading={saveWalletLoading}
      error={saveWalletError}
      popconfirmMsg="Encrypted wallet will be saved to browser localStorage"
    />, */
  ];


  const subHeader = isComfirmed ? existingWalletSubHeader : noWalletSubHeader;

  return (
    <DivAny>
      {subHeader}
    </DivAny>
  );
}

(SubHeader as any).propTypes = {
  onGenerateWallet: PropTypes.func,
  onShowRestoreWallet: PropTypes.func,
  isComfirmed: PropTypes.bool,
  onCloseWallet: PropTypes.func,
  onLockWallet: PropTypes.func,
  password: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onUnlockWallet: PropTypes.func,
  /* optional laod / save buttons
  onSaveWallet: PropTypes.func,
  saveWalletLoading: PropTypes.bool,
  saveWalletError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
   onLoadWallet: PropTypes.func,
  loadWalletLoading: PropTypes.bool,
  loadWalletError: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]), */
};

export default SubHeader;
