
import { createSelector } from 'reselect';

// The redux state tree is an Immutable.Map; sendtoken state values are
// dynamic (fromJS), so getters stay loosely typed. Same convention as
// HomePage/selectors.
type ImmutableState = {
  get: (key: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

/**
 * Direct selector to the sendToken state domain
 */
const selectSendTokenDomain = (state: ImmutableState) => state.get('sendtoken');


const makeSelectFrom = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('from')
);

const makeSelectTo = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('to')
);

const makeSelectAmount = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('amount')
);

const makeSelectGasPrice = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('gasPrice')
);

const makeSelectSendTokenSymbol = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('sendTokenSymbol')
);

const makeSelectComfirmationLoading = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('comfirmationLoading')
);

const makeSelectConfirmationError = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('confirmationError')
);

const makeSelectConfirmationMsg = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('confirmationMsg')
);

const makeSelectSendInProgress = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('sendInProgress')
);

const makeSelectSendError = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('sendError')
);

const makeSelectSendTx = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('sendTx')
);

const makeSelectLocked = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('locked')
);

const makeSelectIsSendComfirmationLocked = () => createSelector(
  selectSendTokenDomain,
  (substate) => substate.get('sendInProgress') !== false || substate.get('sendTx') !== false
);

// export default makeSelectSendToken;
export {
  selectSendTokenDomain,

  makeSelectFrom,
  makeSelectTo,
  makeSelectAmount,
  makeSelectGasPrice,
  makeSelectLocked,
  makeSelectSendTokenSymbol,

  makeSelectComfirmationLoading,
  makeSelectConfirmationError,
  makeSelectConfirmationMsg,

  makeSelectIsSendComfirmationLocked,

  makeSelectSendInProgress,
  makeSelectSendError,
  makeSelectSendTx,
};
