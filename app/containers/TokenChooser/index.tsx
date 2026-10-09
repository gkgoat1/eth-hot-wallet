/**
 * TokenChooser — modal for selecting which tokens to track.
 */
import React from 'react';
import { Modal as AntdModal, Button } from 'antd';

// SAFETY: antd 3's Modal .d.ts omits `children` from ModalProps, which React 18
// JSX requires; at runtime Modal renders children normally. Cast once to a
// props-loose component.
const Modal = AntdModal as unknown as React.ComponentType<Record<string, unknown>>;
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectReducer from 'utils/injectReducer';

import TokenChooserList from 'components/TokenChooserList';
import { makeSelectNetworkName } from 'containers/Header/selectors';
import { makeSelectChosenTokens } from './selectors';
import { toggleToken, confirmNewTokenInfo, type TokenInfoEntry } from './actions';
import reducer from './reducer';

import TokenSelection from './token-lists';

interface TokenChooserProps {
  isShowTokenChooser?: boolean;
  onHideTokenChooser?: () => void;
  chosenTokens?: Record<string, boolean>;
  onToggleToken?: (symbol: string, toggle: boolean) => void;
  onConfirmNewTokenInfo?: (chosenTokens?: Record<string, boolean>, networkName?: string) => void;
  networkName?: string;
}

function TokenChooser(props: TokenChooserProps) {
  const {
    isShowTokenChooser,
    onHideTokenChooser,
    chosenTokens,
    onToggleToken,
    onConfirmNewTokenInfo,
    networkName,
  } = props;

  const tokensForNetwork = (networkName && TokenSelection[networkName]) || [];

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Modal
        visible={isShowTokenChooser}
        title={`Select Tokens - ${networkName}`}
        onOk={onHideTokenChooser}
        onCancel={onHideTokenChooser}
        footer={null}
      >
        <TokenChooserList
          tokenList={tokensForNetwork}
          chosenTokens={chosenTokens}
          onTokenToggle={onToggleToken}
        />
        <br />
        <Button
          type="primary"
          onClick={() => onConfirmNewTokenInfo?.(chosenTokens, networkName)}
          disabled={false}
        >
          Update
        </Button>{' '}
        <Button onClick={() => onConfirmNewTokenInfo?.()} disabled={false}>
          Remove Tokens
        </Button>
      </Modal>
    </div>
  );
}

// SAFETY: createStructuredSelector + react-redux connect are loosely typed for
// the immutable-state selectors used here; the selector outputs and dispatch
// wrappers match the runtime shape. Typed as the structured map the app uses.
interface StateProps {
  chosenTokens?: Record<string, boolean>;
  networkName?: string;
}

// SAFETY: createStructuredSelector's generic overloads don't accept the immutable-state
// selectors used here; the runtime output is the structured map below.
const mapStateToProps = (createStructuredSelector as (s: Record<string, unknown>) => (state: unknown) => { chosenTokens?: Record<string, boolean>; networkName?: string })({
  chosenTokens: makeSelectChosenTokens(),
  networkName: makeSelectNetworkName(),
});

interface DispatchProps {
  onToggleToken: (symbol: string, toggle: boolean) => void;
  onConfirmNewTokenInfo: (chosenTokens?: Record<string, boolean>, networkName?: string) => void;
}

function mapDispatchToProps(dispatch: (action: unknown) => unknown): DispatchProps {
  return {
    onToggleToken: (symbol, toggle) => {
      dispatch(toggleToken(symbol, toggle));
    },
    onConfirmNewTokenInfo: (chosenTokens, networkName) => {
      dispatch(confirmNewTokenInfo(chosenTokens ?? null, networkName ?? ''));
    },
  };
}

// SAFETY: react-redux connect + redux compose + injectReducer don't compose
// their types; the runtime HOC chain is the established one. Asserting the
// final props type.
const enhanced: React.ComponentType<TokenChooserProps> = compose(
  // SAFETY: reducer's concrete action union vs injectReducer's (unknown, unknown); redux dispatches are dynamically typed at runtime.
  injectReducer({ key: 'tokenchooser', reducer: reducer as unknown as (state: unknown, action: unknown) => unknown }),
  connect(mapStateToProps as never, mapDispatchToProps as never),
)(TokenChooser) as React.ComponentType<TokenChooserProps>;

export default enhanced;
