/**
 *
 * SendToken
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal as AntdModal, Button as AntdButton } from 'antd';
// @ts-ignore react-redux 5 has no bundled typings; connect is used untyped (React 15 legacy).
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

// import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import SendFrom from 'components/SendFrom';
import SendTo from 'components/SendTo';
import SendAmount from 'components/SendAmount';
import SendTokenSymbol from 'components/SendTokenSymbol';
import SendGasPrice from 'components/SendGasPrice';
import SendConfirmationView from 'components/SendConfirmationView';
import SendProgress from 'components/SendProgress';

import { makeSelectAddressList, makeSelectTokenInfoList } from 'containers/HomePage/selectors';
import { makeSelectTxExplorer } from 'containers/Header/selectors';

import {
  changeFrom,
  changeAmount,
  changeTo,
  changeGasPrice,
  confirmSendTransaction,
  sendTransaction,
  abortTransaction,
} from './actions';

import {
  makeSelectFrom,
  makeSelectTo,
  makeSelectAmount,
  makeSelectGasPrice,
  makeSelectLocked,
  makeSelectComfirmationLoading,
  makeSelectConfirmationError,
  makeSelectConfirmationMsg,
  makeSelectIsSendComfirmationLocked,
  makeSelectSendInProgress,
  makeSelectSendError,
  makeSelectSendTx,
  makeSelectSendTokenSymbol,
} from './selectors';
import reducer from './reducer';
// import saga from './saga';
// import messages from './messages';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose Component type lacks the `refs` member
// that @types/react@15's JSX.ElementClass requires. Runtime components are
// unchanged; these aliases only re-type them for the app's React 15 JSX
// checking (same convention as components/NetworkMenu).
const Modal = AntdModal as unknown as React.ComponentType<any>;
const Button = AntdButton as unknown as React.ComponentType<any>;

// Loose DOM event type for the dispatched handlers below; they only touch
// preventDefault and (for input handlers) target.value.
interface HandlerEvent {
  preventDefault?: () => void;
  target?: { value: string };
}

interface SendTokenProps {
  isShowSendToken?: boolean;
  onHideSendToken: () => void;

  from?: string | boolean;
  to?: string | boolean;
  addressList?: object | boolean;
  // NOTE: a single handler is shared by SendFrom (address) and SendTokenSymbol
  // (synthetic event + token symbol), so the loose event union mirrors that usage.
  onChangeFrom: (address: string | React.SyntheticEvent<HTMLElement> | null, sendTokenSymbol?: string) => void;
  amount?: number;
  locked?: boolean;
  onChangeAmount: (amount: number) => void;
  onChangeTo: (evt: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  gasPrice?: number;
  onChangeGasPrice: (value: number) => void;
  comfirmationLoading?: boolean;
  confirmationError?: string | boolean;
  confirmationMsg?: string | boolean;
  isSendComfirmationLocked?: boolean;
  onConfirmSendTransaction: (evt?: HandlerEvent) => void;
  onSendTransaction: (evt?: HandlerEvent) => void;
  onAbortTransaction: (evt?: HandlerEvent) => void;

  sendTokenSymbol?: string;
  tokenInfoList?: string[];

  sendInProgress?: boolean;
  sendError?: string | boolean;
  sendTx?: string | boolean;

  txExplorer?: string;
}

function SendToken(props: SendTokenProps) {
  const {
    isShowSendToken,
    onHideSendToken,

    from,
    to,
    addressList,
    onChangeFrom,
    amount,
    locked,
    onChangeAmount,
    onChangeTo,
    gasPrice,
    onChangeGasPrice,
    comfirmationLoading,
    confirmationError,
    confirmationMsg,
    isSendComfirmationLocked,
    onConfirmSendTransaction,
    onSendTransaction,
    onAbortTransaction,

    sendTokenSymbol,
    tokenInfoList,

    sendInProgress,
    sendError,
    sendTx,

    txExplorer,
    } = props;


  const SendFromProps = { from, addressList, onChangeFrom, locked };
  const SendAmountProps = { amount, onChangeAmount, locked };
  const SendToProps = {
    // SAFETY: the sendtoken reducer stores `false` until an address is
    // entered; SendTo renders the field uncontrolled in that case. Only
    // `false` is dropped here so an entered-but-cleared '' is preserved.
    to: (to === false ? undefined : to) as string | undefined,
    onChangeTo,
    locked,
  };
  const SendGasPriceProps = { gasPrice, onChangeGasPrice, locked };

  const SendConfirmationViewProps = {
    comfirmationLoading,
    confirmationError,
    confirmationMsg,
    onSendTransaction,
    onAbortTransaction,
    sendInProgress,
    isSendComfirmationLocked,
    sendError,
  };
  const SendProgressProps = { sendInProgress, sendError, sendTx, txExplorer };

  const SendTokenSymbolProps = { sendTokenSymbol, tokenInfoList, onChangeFrom, locked };

  // SAFETY: antd 3 Modal.footer accepts an array of React nodes; the cast
  // bridges the React 15/19 ReactNode mismatch from the aliased Button above.
  const modalFooter = [
    <Button key="reset" type="default" size="large" onClick={onAbortTransaction}>
      Reset
    </Button>,
    <Button key="close" type="default" size="large" onClick={onHideSendToken}>
      Close
    </Button>,
  ] as any;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Modal
        visible={isShowSendToken}
        title="Send Token"
        onOk={onHideSendToken}
        onCancel={onHideSendToken}
        footer={modalFooter}
      >
        <SendFrom {...SendFromProps} /> <br />
        <SendAmount {...SendAmountProps} />
        <SendTokenSymbol {...SendTokenSymbolProps} /><br /> <br />
        <SendTo {...SendToProps} /> <br />
        <SendGasPrice {...SendGasPriceProps} /> <br />
        <Button onClick={onConfirmSendTransaction} disabled={locked} >
          Create transaction
        </Button>
        <SendConfirmationView {...SendConfirmationViewProps} />
        <br />
        <SendProgress {...SendProgressProps} />
      </Modal>
    </div>
  );
}

SendToken.propTypes = {
  onChangeFrom: PropTypes.func.isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeTo: PropTypes.func.isRequired,
  onChangeGasPrice: PropTypes.func.isRequired,
  onConfirmSendTransaction: PropTypes.func.isRequired,
  onSendTransaction: PropTypes.func.isRequired,
  onAbortTransaction: PropTypes.func.isRequired,

  from: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  to: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),

  amount: PropTypes.number,
  gasPrice: PropTypes.number,
  sendTokenSymbol: PropTypes.string,
  tokenInfoList: PropTypes.array,

  locked: PropTypes.bool,

  comfirmationLoading: PropTypes.oneOfType([PropTypes.bool]),
  confirmationError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  confirmationMsg: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),

  isSendComfirmationLocked: PropTypes.bool,

  sendInProgress: PropTypes.oneOfType([PropTypes.bool]),
  sendError: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  sendTx: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),

  isShowSendToken: PropTypes.bool,
  onHideSendToken: PropTypes.func,
  addressList: PropTypes.oneOfType([
    // PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
  txExplorer: PropTypes.string,
};

// SAFETY: createStructuredSelector's reselect 3 typings infer the store state
// as `unknown` while the selectors key off ImmutableState; the app state is an
// Immutable.Map, so the cast only re-aligns the inferred state parameter.
const mapStateToProps = createStructuredSelector({
  from: makeSelectFrom(),
  to: makeSelectTo(),
  amount: makeSelectAmount(),
  addressList: makeSelectAddressList(),
  gasPrice: makeSelectGasPrice(),

  sendTokenSymbol: makeSelectSendTokenSymbol(),
  tokenInfoList: makeSelectTokenInfoList(),

  locked: makeSelectLocked(),

  comfirmationLoading: makeSelectComfirmationLoading(),
  confirmationError: makeSelectConfirmationError(),
  confirmationMsg: makeSelectConfirmationMsg(),

  isSendComfirmationLocked: makeSelectIsSendComfirmationLocked(),

  sendInProgress: makeSelectSendInProgress(),
  sendError: makeSelectSendError(),
  sendTx: makeSelectSendTx(),

  txExplorer: makeSelectTxExplorer(),

} as any) as (state: unknown) => Partial<SendTokenProps>;

function mapDispatchToProps(dispatch: (action: { type: string }) => void) {
  return {
    onChangeFrom: (address?: string | null, sendTokenSymbol?: string) => {
      dispatch(changeFrom(address, sendTokenSymbol));
    },
    onChangeAmount: (amount: number) => {
      dispatch(changeAmount(amount));
    },
    onChangeTo: (evt: HandlerEvent) => {
      // SAFETY: input change events always carry a target with a value.
      dispatch(changeTo((evt.target as { value: string }).value));
    },
    onChangeGasPrice: (value: number | string) => {
      dispatch(changeGasPrice(value));
    },
    onConfirmSendTransaction: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(confirmSendTransaction());
    },
    onAbortTransaction: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(abortTransaction());
    },
    onSendTransaction: (evt?: HandlerEvent) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(sendTransaction());
    },
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// SAFETY: the reducer keys its action by a concrete union while injectReducer
// accepts (state: unknown, action: unknown); redux dispatches are dynamically
// typed at runtime, so the cast only widens the parameter types.
const withReducer = injectReducer({ key: 'sendtoken', reducer: reducer as (state: unknown, action: unknown) => unknown });
// const withSaga = injectSaga({ key: 'sendtoken', saga });

// SAFETY: redux 3 `compose` typings don't track these higher-order component
// signatures (react-redux is untyped); the runtime composition is unchanged.
const enhanced = (compose(
  withReducer,
  // withSaga,
  withConnect,
) as (component: React.ComponentType<any>) => React.ComponentType<any>)(SendToken);

export default enhanced;
