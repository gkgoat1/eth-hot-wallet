/**
*
* GenerateWalletModal
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { Modal as AntdModal, Button as AntdButton, Alert as AntdAlert } from 'antd';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm (node_modules/.pnpm/node_modules), whose Component
// type lacks the `refs` member that @types/react@15's JSX.ElementClass requires.
// The runtime components are unchanged; these aliases only re-type them for the
// app's React 15 JSX checking.
const Modal = AntdModal as unknown as React.ComponentType<any>;
const Button = AntdButton as unknown as React.ComponentType<any>;
const Alert = AntdAlert as unknown as React.ComponentType<any>;

interface GenerateWalletModalProps {
  isShowGenerateWallet?: boolean;
  generateWalletLoading?: boolean;
  // generateWalletError?: object | string | boolean;
  seed?: string | boolean;
  password?: string | boolean;

  onGenerateWallet?: () => void;
  onGenerateWalletCancel?: () => void;
  onGenerateKeystore?: () => void;
}

function GenerateWalletModal(props: GenerateWalletModalProps) {
  const {
    isShowGenerateWallet,
    generateWalletLoading,
    // generateWalletError,
    seed,
    password,

    onGenerateWallet,
    onGenerateWalletCancel,
    onGenerateKeystore,
    } = props;

  return (
    <Modal
      visible={isShowGenerateWallet}
      title="New Wallet"
      onOk={onGenerateKeystore}
      onCancel={onGenerateWalletCancel}
      footer={[
        <Button key="submit" type="primary" size="large" onClick={onGenerateKeystore}>
          Create
        </Button>,
      ]}
    >
      <Alert
        message={<b>The seed is imposible to recover if lost</b>}
        description={<b>Copy the generated seed to a safe location.<br />
                        HDPathString: m/44'/60'/0'/0.<br /> Recover lost password using the seed.</b>} // eslint-disable-line
        type="warning"
        showIcon
        closable
      />
      <br />
      <Alert
        message="Seed:"
        description={<b>{seed}</b>}
        type="info"
      />
      <br />
      <Alert
        message="Password for browser encryption:"
        description={<b>{password}</b>}
        type="info"
      />
      <br />
      <Button shape="circle" icon="reload" loading={generateWalletLoading} key="back" size="large" onClick={onGenerateWallet} />
    </Modal>
  );
}

// SAFETY: propTypes is a React runtime field; without @types/react the plain
// function type has no such property, so the cast only re-exposes it.
(GenerateWalletModal as any).propTypes = {
  isShowGenerateWallet: PropTypes.bool,
  generateWalletLoading: PropTypes.bool,
  /* generateWalletError: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.bool,
  ]), */
  seed: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  password: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  onGenerateWallet: PropTypes.func,
  onGenerateWalletCancel: PropTypes.func,
  onGenerateKeystore: PropTypes.func,
};

export default GenerateWalletModal;
