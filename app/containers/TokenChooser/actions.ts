/*
 * TokenChooser actions
 */
import { TOGGLE_TOKEN, CONFIRM_UPDATE_TOKEN_INFO } from './constants';
import { TokenSelection } from './token-lists';

export interface ToggleTokenAction {
  type: typeof TOGGLE_TOKEN;
  symbol: string;
  toggle: boolean;
}

export interface TokenInfoEntry {
  name: string;
  contractAddress: string;
  decimals: number;
  url: string;
}

export interface ConfirmUpdateTokenInfoAction {
  type: typeof CONFIRM_UPDATE_TOKEN_INFO;
  tokenInfo: Record<string, TokenInfoEntry>;
}

/**
 * Changes whether a single token is selected
 */
export function toggleToken(symbol: string, toggle: boolean): ToggleTokenAction {
  return { type: TOGGLE_TOKEN, symbol, toggle };
}

/**
 * confirm new tokens
 */
export function confirmNewTokenInfo(
  chosenTokens: Record<string, boolean> | null,
  networkName: string,
): ConfirmUpdateTokenInfoAction {
  if (!chosenTokens) {
    return { type: CONFIRM_UPDATE_TOKEN_INFO, tokenInfo: {} };
  }

  const filteredArray = TokenSelection[networkName].filter((x) => chosenTokens[x.symbol]);

  const tokenInfo = filteredArray.reduce(
    (acc: Record<string, TokenInfoEntry>, current) => {
      const { symbol, description, ...newObject } = current;
      void description;
      acc[symbol] = newObject;
      return acc;
    },
    {},
  );

  return { type: CONFIRM_UPDATE_TOKEN_INFO, tokenInfo };
}
