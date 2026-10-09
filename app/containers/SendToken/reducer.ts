/*
 *
 * SendToken reducer
 *
 */
import {
  CHANGE_FROM,
  CHANGE_AMOUNT,
  CHANGE_TO,
  CHANGE_GAS_PRICE,

  COMFIRM_SEND_TRANSACTION,
  COMFIRM_SEND_TRANSACTION_SUCCESS,
  COMFIRM_SEND_TRANSACTION_ERROR,

  ABORT_TRANSACTION,
  SEND_TRANSACTION,
  SEND_TRANSACTION_SUCCESS,
  SEND_TRANSACTION_ERROR,

} from './constants';

// Loose action shape covering every action this reducer handles. Matches the
// optional fields of the interfaces in ./actions.
interface SendTokenAction {
  type: string;
  address?: string | null;
  sendTokenSymbol?: string;
  amount?: number;
  gasPrice?: number | string;
  msg?: string;
  error?: string | boolean | object;
  tx?: string | boolean;
}

export interface SendTokenState {
  from: string;
  to: string;
  amount: number;
  gasPrice: number | string; // gwei
  locked: boolean;
  sendTokenSymbol: string;

  comfirmationLoading: boolean;
  confirmationError: string | boolean | object;
  confirmationMsg: string | false;

  sendInProgress: boolean;
  sendError: string | boolean | object;
  sendTx: string | boolean;
}

const initialState: SendTokenState = {
  from: '',
  to: '',
  amount: 0,
  gasPrice: 10, // gwei
  locked: false,
  sendTokenSymbol: 'eth',

  comfirmationLoading: false,
  confirmationError: false,
  confirmationMsg: false,

  sendInProgress: false,
  sendError: false,
  sendTx: false,

};

function sendTokenReducer(state: SendTokenState = initialState, action: SendTokenAction): SendTokenState {
  switch (action.type) {
    case CHANGE_FROM:
      // update values only if provided:
      return {
        ...state,
        from: action.address || state.from,
        sendTokenSymbol: action.sendTokenSymbol || state.sendTokenSymbol,
      };
    case CHANGE_AMOUNT:
      return {
        ...state,
        // SAFETY: action.amount is always set by changeAmount() in actions.ts
        amount: action.amount as number,
      };

    case CHANGE_TO:
      return {
        ...state,
        // SAFETY: action.address is always set by changeTo() in actions.ts
        to: action.address as string,
      };

    case CHANGE_GAS_PRICE:
      return {
        ...state,
        // SAFETY: action.gasPrice is always set by changeGasPrice() in actions.ts
        gasPrice: action.gasPrice as number | string,
      };

    case COMFIRM_SEND_TRANSACTION:
      return {
        ...state,
        comfirmationLoading: true,
        locked: true,
      };
    case COMFIRM_SEND_TRANSACTION_SUCCESS:
      return {
        ...state,
        comfirmationLoading: false,
        // SAFETY: action.msg is always set by comfirmSendTransactionSuccess() in actions.ts
        confirmationMsg: action.msg as string,
        confirmationError: false,
      };
    case COMFIRM_SEND_TRANSACTION_ERROR:
      return {
        ...state,
        comfirmationLoading: false,
        // SAFETY: action.error is always set by comfirmSendTransactionError() in actions.ts
        confirmationError: action.error as string | boolean | object,
        locked: false,
      };
    case ABORT_TRANSACTION:
      return {
        ...state,
        comfirmationLoading: false,
        confirmationMsg: false,
        confirmationError: false,
        locked: false,
        sendError: false,
        sendTx: false,
      };

    case SEND_TRANSACTION:
      return {
        ...state,
        sendInProgress: true,
        sendError: false,
        sendTx: false,
      };
    case SEND_TRANSACTION_SUCCESS:
      return {
        ...state,
        sendInProgress: false,
        sendError: false,
        // SAFETY: action.tx is always set by sendTransactionSuccess() in actions.ts
        sendTx: action.tx as string | boolean,
      };
    case SEND_TRANSACTION_ERROR:
      return {
        ...state,
        sendInProgress: false,
        // SAFETY: action.error is always set by sendTransactionError() in actions.ts
        sendError: action.error as string | boolean | object,
        sendTx: false,
      };

    default:
      return state;
  }
}

export default sendTokenReducer;
