import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startAnvil, type AnvilInstance } from '../anvil';

describe('anvil harness', () => {
  let anvil: AnvilInstance;

  beforeAll(async () => {
    anvil = await startAnvil();
  });

  afterAll(async () => {
    await anvil?.stop();
  });

  it('answers eth_chainId', async () => {
    const chainId = await anvil.rpc<string>('eth_chainId');
    expect(BigInt(chainId)).toBe(BigInt(anvil.chainId));
  });

  it('has funded dev accounts', async () => {
    const accounts = await anvil.rpc<string[]>('eth_accounts');
    expect(accounts.length).toBeGreaterThanOrEqual(10);
    const balance = await anvil.rpc<string>('eth_getBalance', [accounts[0], 'latest']);
    expect(BigInt(balance)).toBeGreaterThan(0n);
  });

  it('mines blocks', async () => {
    const block = await anvil.rpc<string>('eth_blockNumber');
    expect(BigInt(block)).toBeGreaterThanOrEqual(0n);
  });
});
