// @vitest-environment jsdom
/**
 * Regression test for plan §9.1: Header/saga loadNetwork used to dispatch
 * updateTokenInfo(keystore.getAddresses, action.tokenInfo) — a method
 * reference (arity 0 => empty addressMap) and an undefined tokenInfo —
 * silently wiping the address list on every network change. The fix calls
 * getAddresses() and passes {} (token list resets to the eth-only default).
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('@eth-hot-wallet/web3-adapter', () => ({
  createWeb3Adapter: () => ({
    getBlockNumber: () => Promise.resolve(1n),
    getBalance: () => Promise.resolve(0n),
    erc20BalanceOf: () => Promise.resolve(0n),
    isAddress: () => true,
  }),
}));

// Header/actions imports { store } from the app entry (app.jsx), which runs
// ReactDOM.render on import. Mock the entry module: the saga under test never
// touches the store; the import is incidental. (Decoupling store from the
// entry point is Phase 6 RTK work.)
vi.mock('../../app/app', () => ({
  store: { dispatch: vi.fn(), getState: () => ({}), subscribe: vi.fn() },
}));

import { loadNetwork } from '../../app/containers/Header/saga';

const fakeKeystore = {
  getAddresses: () => ['0xaaa', '0xbbb'],
  passwordProvider: (cb: (e: unknown, p?: string) => void) => cb(null, 'x'),
};

// redux-saga 0.15 effect shapes: { '@@redux-saga/IO': true, SELECT/CALL/PUT: {...} }
interface SagaEffect {
  SELECT?: unknown;
  CALL?: unknown;
  PUT?: { action: { type: string; addressMap?: Record<string, unknown> } };
}

/** Collect the saga's yielded effects, feeding stub results to selects/calls. */
function runLoadNetwork(prevNetwork: string): SagaEffect[] {
  const gen = loadNetwork({ type: 'x', networkName: 'Local RPC' } as never);
  const effects: SagaEffect[] = [];
  const feeds = [
    undefined, // initial next()
    fakeKeystore, // <- SELECT keystore
    1n, // <- CALL getBlockNumber
    undefined, // <- CALL timer
    undefined, // <- PUT loadNetworkSuccess
    undefined, // <- PUT checkBalances
    undefined, // <- PUT getExchangeRates
    prevNetwork, // <- SELECT prevNetworkName
    true, // <- SELECT usedFaucet (or beyond)
    undefined,
  ];
  for (const feed of feeds) {
    const step = gen.next(feed as never);
    if (step.done) break;
    effects.push(step.value as SagaEffect);
  }
  return effects;
}

describe('loadNetwork (regression: §9.1)', () => {
  it('dispatches updateTokenInfo with the full address map when network changed', () => {
    const effects = runLoadNetwork('Ropsten Testnet'); // prev != current
    const update = effects.find(
      (e) => e.PUT && e.PUT.action.type.includes('UPDATE_TOKEN_INFO'),
    );
    expect(update).toBeDefined();
    // The bug produced {} (function reference has .length 0). The fix yields
    // an entry per keystore address.
    expect(Object.keys(update!.PUT!.action.addressMap ?? {})).toEqual(['0xaaa', '0xbbb']);
  });

  it('does not dispatch updateTokenInfo when network is unchanged', () => {
    const effects = runLoadNetwork('Local RPC'); // prev == current
    expect(
      effects.some((e) => e.PUT && e.PUT.action.type.includes('UPDATE_TOKEN_INFO')),
    ).toBe(false);
  });
});
