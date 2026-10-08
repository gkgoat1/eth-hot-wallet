/**
 * Anvil integration tests for @eth-hot-wallet/web3-adapter.
 *
 * Exercises the real signing path: a lightwallet keystore (the modernized
 * eth-lightwallet-next) signs a raw tx via passwordProvider, the adapter
 * broadcasts it, and the chain executes it. This is the exact behavior the
 * app relies on from web3@0.20 + the vendored signer.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startAnvil, type AnvilInstance } from '../../../test/anvil';
import { createWeb3Adapter, parseEther, type LightwalletKeystore } from '../src/index';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

const golden = JSON.parse(
  readFileSync(
    resolve(here, '../../../test/goldens/eth-lightwallet/vault-4.0.0.json'),
    'utf8',
  ),
);
const PASSWORD = golden.kdf.password;

const lw = require('eth-lightwallet-next');

const artifact = JSON.parse(
  readFileSync(resolve(here, 'TestToken.artifact.json'), 'utf8'),
);

async function makeKeystore(): Promise<LightwalletKeystore> {
  const input = golden.vault.input;
  const ks: any = await new Promise((res, rej) =>
    lw.keystore.createVault(
      {
        password: input.password,
        seedPhrase: input.mnemonic,
        salt: input.salt,
        hdPathString: input.hdPathString,
      },
      (err: unknown, k: unknown) => (err ? rej(err) : res(k)),
    ),
  );
  const key: Uint8Array = await new Promise((res, rej) =>
    ks.keyFromPassword(input.password, (err: unknown, k2: Uint8Array) =>
      err ? rej(err) : res(k2),
    ),
  );
  ks.generateNewAddress(key, 2);
  return ks as LightwalletKeystore;
}

describe('web3-adapter on anvil', () => {
  let anvil: AnvilInstance;
  let adapter: ReturnType<typeof createWeb3Adapter>;
  let keystore: LightwalletKeystore;
  let addresses: string[];

  beforeAll(async () => {
    anvil = await startAnvil();
    keystore = await makeKeystore();
    addresses = keystore.getAddresses().map((a) => (a.startsWith('0x') ? a : `0x${a}`));
    adapter = createWeb3Adapter({ rpcUrl: anvil.url, keystore });
  });

  afterAll(async () => {
    await anvil?.stop();
  });

  it('reads block number and balance', async () => {
    const block = await adapter.getBlockNumber();
    expect(block).toBeGreaterThanOrEqual(0n);
    const bal = await adapter.getBalance(addresses[0]);
    expect(bal).toBe(0n); // fresh keystore address, unfunded
  });

  it('sendEth signs with the keystore and transfers value', async () => {
    const from = addresses[0];
    const to = addresses[1];
    await anvil.rpc('anvil_setBalance', [from, '0xde0b6b3a7640000']); // 1 ETH

    const valueWei = parseEther('0.25');
    // use the anvil gas price
    const gasPrice = BigInt(await anvil.rpc<string>('eth_gasPrice'));
    const txHash = await adapter.sendEth({
      password: PASSWORD,
      from,
      to,
      valueWei,
      gasPriceWei: gasPrice,
      gas: 21000,
    });
    expect(txHash).toMatch(/^0x[0-9a-f]{64}$/);

    const receipt = await adapter.publicClient.waitForTransactionReceipt({ hash: txHash });
    expect(receipt.status).toBe('success');
    expect(receipt.from.toLowerCase()).toBe(from.toLowerCase());
    expect(receipt.to?.toLowerCase()).toBe(to.toLowerCase());

    const toBal = await adapter.getBalance(to);
    expect(toBal).toBe(valueWei);
  });

  it('erc20Transfer signs and transfers tokens', async () => {
    const owner = addresses[0];
    const recipient = addresses[1];

    // deploy the test token from a funded anvil account (deployment needn't
    // go through the keystore — only the transfer does).
    const [deployer] = await anvil.rpc<string[]>('eth_accounts');
    const supply = parseEther('1000');
    // artifact.bytecode is already 0x-prefixed; append constructor arg.
    const deployData = artifact.bytecode + supply.toString(16).padStart(64, '0');
    const deployTx = await anvil.rpc<string>('eth_sendTransaction', [
      {
        from: deployer,
        data: deployData,
        gas: '0x300000',
      },
    ]);
    await anvil.rpc('evm_mine', []);
    const deployReceipt = await anvil.rpc<{ contractAddress: string; status: string }>(
      'eth_getTransactionReceipt',
      [deployTx],
    );
    expect(deployReceipt.status).toBe('0x1');
    const token = deployReceipt.contractAddress;

    // fund the owner with tokens from the deployer (who holds the supply)
    const fundAmount = parseEther('100');
    const transferData = await import('viem').then((v) =>
      v.encodeFunctionData({
        abi: artifact.abi,
        functionName: 'transfer',
        args: [owner, fundAmount],
      }),
    );
    await anvil.rpc('eth_sendTransaction', [
      { from: deployer, to: token, data: transferData, gas: '0x100000' },
    ]);
    await anvil.rpc('evm_mine', []);
    expect(await adapter.erc20BalanceOf(token, owner)).toBe(fundAmount);

    // now the keystore-signed transfer
    const sendAmount = parseEther('40');
    const gasPrice = BigInt(await anvil.rpc<string>('eth_gasPrice'));
    const txHash = await adapter.erc20Transfer({
      password: PASSWORD,
      contract: token,
      from: owner,
      to: recipient,
      amount: sendAmount,
      gasPriceWei: gasPrice,
      gas: 100000,
    });
    const receipt = await adapter.publicClient.waitForTransactionReceipt({ hash: txHash });
    expect(receipt.status).toBe('success');

    expect(await adapter.erc20BalanceOf(token, recipient)).toBe(sendAmount);
    expect(await adapter.erc20BalanceOf(token, owner)).toBe(fundAmount - sendAmount);
  });
});
