/**
*
* RestoreWalletModal
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal as AntdModal, Button as AntdButton, Input as AntdInput, Tooltip as AntdTooltip } from 'antd';
import { CloseCircleFilled, CloseCircleOutlined, KeyOutlined, WalletOutlined } from '@ant-design/icons';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm (node_modules/.pnpm/node_modules), whose Component
// type lacks the `refs` member that @types/react@15's JSX.ElementClass requires.
// styled-components v2's bundled typings resolve 'react' the same way. The
// runtime components are unchanged; these aliases only re-type them for the
// app's React 15 JSX checking.
const Modal = AntdModal as unknown as React.ComponentType<any>;
const Button = AntdButton as unknown as React.ComponentType<any>;
const Input = AntdInput as unknown as React.ComponentType<any>;
const Tooltip = AntdTooltip as unknown as React.ComponentType<any>;

const Div = styled.div`
  margin-top: 12px;
` as unknown as React.ComponentType<any>;

const Span = styled.span`
  color: red;
  font-size: 21px;
  padding-right: 12px;
  vertical-align: sub;
` as unknown as React.ComponentType<any>;

const Description = styled.div`
  margin-bottom: 10px;
` as unknown as React.ComponentType<any>;

interface RestoreWalletModalProps {
  isShowRestoreWallet?: boolean;
  userSeed?: string;
  userPassword?: string;
  onChangeUserSeed?: (evt: any) => void;
  onChangeUserPassword?: (evt: any) => void;
  restoreWalletError?: object | string | boolean;
  onRestoreWalletCancel?: () => void;
  onRestoreWalletFromSeed?: (evt: any) => void;
}

function RestoreWalletModal(props: RestoreWalletModalProps) {
  const { isShowRestoreWallet, userSeed, userPassword, restoreWalletError, onChangeUserSeed, onChangeUserPassword, onRestoreWalletCancel, onRestoreWalletFromSeed } = props;
  // const suffix = userSeed ? <CloseCircleFilled onClick={this.emitEmpty} /> : null;
  const errorComponent =
    (<Span key="error">
      <Tooltip placement="bottom" title={restoreWalletError}>
        <CloseCircleOutlined style={{ color: 'red' }} />
      </Tooltip>
    </Span>);

  return (
    <Modal
      visible={isShowRestoreWallet}
      title="Restore Wallet"
      onOk={onRestoreWalletCancel}
      onCancel={onRestoreWalletCancel}
      footer={[
        restoreWalletError ? errorComponent : null,
        <Button key="submit" type="primary" size="large" onClick={onRestoreWalletFromSeed} >
          Restore
        </Button >,
      ]}
    >
      <Description> {"HDPathString m/44'/60'/0'/0 is used for address generation"}</Description>
      <Input
        placeholder="Enter seed"
        prefix={<WalletOutlined />}
        value={userSeed}
        onChange={onChangeUserSeed}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <Div>
        <Input
          placeholder="Enter password for keystore encryption"
          prefix={<KeyOutlined />}
          value={userPassword}
          onChange={onChangeUserPassword}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </Div>
    </Modal>
  );
}

(RestoreWalletModal as any).propTypes = {
  isShowRestoreWallet: PropTypes.bool,
  userSeed: PropTypes.string,
  userPassword: PropTypes.string,
  onChangeUserSeed: PropTypes.func,
  onChangeUserPassword: PropTypes.func,
  restoreWalletError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]),
  onRestoreWalletCancel: PropTypes.func,
  onRestoreWalletFromSeed: PropTypes.func,
};

export default RestoreWalletModal;
