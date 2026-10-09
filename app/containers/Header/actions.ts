/*
 *
 * Header actions
 *
 */
import React from 'react';
import { message, Button as AntdButton, notification as antdNotification } from 'antd';
import FaucetDescription from 'components/FaucetDescription';
import { offlineModeString } from 'utils/constants';
import { BulbOutlined, LoadingOutlined } from '@ant-design/icons';

// SAFETY: antd 3's bundled .d.ts files resolve 'react' to a hoisted
// @types/react@19 under pnpm, whose ReactNode/Component types are incompatible
// with @types/react@15's JSX/ElementClass checking used by this app. Runtime
// behavior is unchanged; these aliases only re-type the statics for React 15.
const Button = AntdButton as unknown as React.ComponentType<any>;
const notification = antdNotification as unknown as {
  open: (config: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  info: (config: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  success: (config: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  error: (config: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  close: (key: string) => void;
  config: (options: { [key: string]: any }) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
};

import {
  LOAD_NETWORK,
  LOAD_NETWORK_SUCCESS,
  LOAD_NETWORK_ERROR,

  CHECK_BALANCES,
  CHECK_BALANCES_SUCCESS,
  CHECK_BALANCES_ERROR,
  STOP_POLL_BALANCES,

  GET_EXCHANGE_RATES,
  GET_EXCHANGE_RATES_SUCCESS,
  GET_EXCHANGE_RATES_ERROR,

  CHECK_FAUCET,
  CHECK_FAUCET_SUCCESS,
  CHECK_FAUCET_ERROR,
  ASK_FAUCET,
  ASK_FAUCET_SUCCESS,
  ASK_FAUCET_ERROR,
} from './constants';

// app/app.jsx is an untyped JS module exporting the configured redux store.
// @ts-ignore
import { store } from '../../app';

export interface LoadNetworkAction {
  type: typeof LOAD_NETWORK;
  networkName: string;
}

export interface LoadNetworkSuccessAction {
  type: typeof LOAD_NETWORK_SUCCESS;
  blockNumber: number | bigint;
}

export interface LoadNetworkErrorAction {
  type: typeof LOAD_NETWORK_ERROR;
  error: string;
}

export interface CheckBalancesAction {
  type: typeof CHECK_BALANCES;
}

export interface CheckBalancesSuccessAction {
  type: typeof CHECK_BALANCES_SUCCESS;
  timeString: string;
}

export interface CheckBalancesErrorAction {
  type: typeof CHECK_BALANCES_ERROR;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface StopPollBalancesAction {
  type: typeof STOP_POLL_BALANCES;
}

export interface GetExchangeRatesAction {
  type: typeof GET_EXCHANGE_RATES;
}

export interface GetExchangeRatesSuccessAction {
  type: typeof GET_EXCHANGE_RATES_SUCCESS;
  timeString: string;
}

export interface GetExchangeRatesErrorAction {
  type: typeof GET_EXCHANGE_RATES_ERROR;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface CheckFaucetAction {
  type: typeof CHECK_FAUCET;
}

export interface CheckFaucetSuccessAction {
  type: typeof CHECK_FAUCET_SUCCESS;
}

export interface CheckFaucetErrorAction {
  type: typeof CHECK_FAUCET_ERROR;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AskFaucetAction {
  type: typeof ASK_FAUCET;
}

export interface AskFaucetSuccessAction {
  type: typeof ASK_FAUCET_SUCCESS;
  tx: string;
}

export interface AskFaucetErrorAction {
  type: typeof ASK_FAUCET_ERROR;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Connect to eth network using address from network.js file
 *
 * @return {object}    An action object with a type of LOAD_NETWORK
 */
export function loadNetwork(networkName: string): LoadNetworkAction {
  return {
    type: LOAD_NETWORK,
    networkName,
  };
}

/**
 * Dispatched when connected to network successfuly by the loadNetwork saga
 *
 * @param  {string} blockNumber The current block number
 *
 * @return {object}      An action object with a type of LOAD_NETWORK_SUCCESS passing the repos
 */
export function loadNetworkSuccess(blockNumber: number | bigint): LoadNetworkSuccessAction {
  message.success(`Connected sucessfully, current block: ${blockNumber}`);
  return {
    type: LOAD_NETWORK_SUCCESS,
    blockNumber,
  };
}

/**
 * Dispatched when network connection fails
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of LOAD_NETWORK_ERROR passing the error
 */
export function loadNetworkError(error: string): LoadNetworkErrorAction {
  if (error !== offlineModeString) {
    const err = error.indexOf('Invalid JSON RPC response from host provider') >= 0 ?
      `${error}, Check Internet connection and connectivity to RPC` : error;
    message.error(err, 10);
  }
  return {
    type: LOAD_NETWORK_ERROR,
    error,
  };
}


/* *********************************** Check Balances Actions ******************* */
/**
 * Initiate process to check balance of all known addresses
 *
 * @return {object}    An action object with a type of CHECK_BALANCES
 */
export function checkBalances(): CheckBalancesAction {
  return {
    type: CHECK_BALANCES,
  };
}

/**
 * checkBalances successful
 *
 * @return {object}      An action object with a type of CHECK_BALANCES_SUCCESS
 */
export function checkBalancesSuccess(): CheckBalancesSuccessAction {
  const timeString = new Date().toLocaleTimeString();
  // message.success('Balances updated succesfully');
  return {
    type: CHECK_BALANCES_SUCCESS,
    timeString,
  };
}

/**
 * checkBalances failed
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of CHECK_BALANCES_ERROR passing the error
 */
export function CheckBalancesError(error: any): CheckBalancesErrorAction { // eslint-disable-line @typescript-eslint/no-explicit-any
  message.error(error);
  return {
    type: CHECK_BALANCES_ERROR,
    error,
  };
}


/**
 * Stop polling balances when going to offline mode
 *
 * @return {object} An action object with a type of STOP_POLL_BALANCES
 */
export function stopPollingBalances(): StopPollBalancesAction {
  return {
    type: STOP_POLL_BALANCES,
  };
}

/* *********************************** Get Exchange Rate Actions ******************* */
/**
 * Get exchange rates from api
 *
 * @return {object}    An action object with a type of CHECK_BALANCES
 */
export function getExchangeRates(): GetExchangeRatesAction {
  return {
    type: GET_EXCHANGE_RATES,
  };
}

/**
 * getExchangeRates successful
 *
 * @return {object}      An action object with a type of GET_EXCHANGE_RATES_SUCCESS
 */
export function getExchangeRatesSuccess(): GetExchangeRatesSuccessAction {
  const timeString = new Date().toLocaleTimeString();
  message.success('Exchange rates updated succesfully');
  return {
    type: GET_EXCHANGE_RATES_SUCCESS,
    timeString,
  };
}

/**
 * getExchangeRates failed
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of CHECK_BALANCES_ERROR passing the error
 */
export function getExchangeRatesError(error: any): GetExchangeRatesErrorAction { // eslint-disable-line @typescript-eslint/no-explicit-any
  message.error(error);
  return {
    type: GET_EXCHANGE_RATES_ERROR,
    error,
  };
}


/* *********************************** Faucet Actions ******************* */

/**
 * Check if faucet availible
 *
 * @return {object}    An action object with a type of CHECK_FAUCET
 */
export function checkFaucet(): CheckFaucetAction {
  return {
    type: CHECK_FAUCET,
  };
}

/**
 * checkFaucet successful will pop notification which can used to ask faucet
 *
 * @return {object}      An action object with a type of CHECK_FAUCET_SUCCESS
 */
export function checkFaucetSuccess(): CheckFaucetSuccessAction {
  //  message.success('Exchange rates updated succesfully');
  const key = `open${Date.now()}`;
  const closeNotification = () => {
    // to hide notification box
    notification.close(key);
  };
  const ask = () => {
    // to hide notification box
    notification.close(key);
    // SAFETY: store.dispatch is redux-5 typed (UnknownAction); AskFaucetAction is a valid flux action at runtime.
    store.dispatch(askFaucet() as never);
  };
  const btn = [
    React.createElement(
      Button,
      { key: 'b1', type: 'default', size: 'default', onClick: closeNotification },
      'No man'
    ),
    '  ',
    React.createElement(
      Button,
      { key: 'b2', type: 'primary', size: 'default', onClick: ask },
      'Sure'
    )];
  notification.config({
    placement: 'bottomRight',
  });
  const icon = React.createElement(BulbOutlined, { style: { color: '#108ee9' } });
  notification.open({
    message: 'Ropsten Testnet faucet',
    description: 'Need some coins for testing?',
    duration: 10,
    key,
    btn,
    icon,
  });
  return {
    type: CHECK_FAUCET_SUCCESS,
  };
}

/**
 * checkFaucetError failed
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of CHECK_FAUCET_ERROR passing the error
 */
export function checkFaucetError(error: any): CheckFaucetErrorAction { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    type: CHECK_FAUCET_ERROR,
    error,
  };
}

/**
 * Check if faucet availible
 *
 * @return {object}    An action object with a type of ASK_FAUCET
 */
export function askFaucet(): AskFaucetAction {
  const icon = React.createElement(LoadingOutlined);
  notification.info({
    message: 'Sending request',
    description: 'Please wait',
    duration: 30,
    key: 'ask',
    icon,
  });
  return {
    type: ASK_FAUCET,
  };
}

/**
 * checkFaucet successful will pop notification which can used to ask faucet
 *
 * @return {object}      An action object with a type of ASK_FAUCET_SUCCESS
 */
export function askFaucetSuccess(tx: string): AskFaucetSuccessAction {
  notification.close('ask');
  const key = `open${Date.now()}`;
  const closeNotification = () => {
    notification.close(key);
  };
  const btn = React.createElement(Button, { type: 'default', size: 'small', onClick: closeNotification }, 'Got it');
  const description = React.createElement(FaucetDescription, { tx, text: 'Check balance in ~30 seconds. TX:' });
  notification.success({
    message: 'Faucet request sucessfull',
    description,
    duration: 10,
    key,
    btn,
  });

  return {
    type: ASK_FAUCET_SUCCESS,
    tx,
  };
}

/**
 * askFaucetError
 *
 * @param  {object} error The error
 *
 * @return {object} An action object with a type of ASK_FAUCET_ERROR passing the error
 */
export function askFaucetError(error: any): AskFaucetErrorAction { // eslint-disable-line @typescript-eslint/no-explicit-any
  const key = `open${Date.now()}`;
  const closeNotification = () => {
    notification.close(key);
  };
  const btn = React.createElement(Button, { type: 'default', size: 'small', onClick: closeNotification }, 'Got it');
  notification.error({
    message: 'Faucet request failed',
    description: `${error}. Please try again later`,
    duration: 10,
    key,
    btn,
  });
  return {
    type: ASK_FAUCET_ERROR,
    error,
  };
}
