/**
 * Golden acceptance gate for the MODERNIZED lib (eth-lightwallet-next, Git dep
 * pinned to gkgoat1/eth-lightwallet#298169e). Lives in its own file because
 * bitcore-lib's versionGuard throws if two instances load in one module
 * graph — vitest isolates files into separate workers, so splitting avoids the
 * double-load with the npm-3.0.1 suite in keystore.test.ts.
 *
 * The new lib must reproduce the identical pins as the original.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

const lw = require('eth-lightwallet-next');
const { keystore, signing } = lw;

const to0x = (a: string) => (a.startsWith('0x') ? a : `0x${a}`);

const GOLDEN_FILES = ['vault-3.0.1.json', 'vault-4.0.0.json'];

function loadGolden(file: string) {
  return JSON.parse(readFileSync(resolve(here, '../goldens/eth-lightwallet', file), 'utf8'));
}

function createVault(input: any): Promise<any> {
  return new Promise((res, rej) =>
    keystore.createVault(
      {
        password: input.password,
        seedPhrase: input.mnemonic,
        salt: input.salt,
        hdPathString: input.hdPathString,
      },
      (err: unknown, ks: unknown) => (err ? rej(err) : res(ks)),
    ),
  );
}

function deriveKey(ks: any, password: string, salt: string): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    if (typeof ks.keyFromPassword === 'function') {
      ks.keyFromPassword(password, (err: unknown, k: Uint8Array) => (err ? rej(err) : res(k)));
    } else {
      keystore.deriveKeyFromPasswordAndSalt(password, salt, (err: unknown, k: Uint8Array) =>
        err ? rej(err) : res(k),
      );
    }
  });
}

describe.each(GOLDEN_FILES)('eth-lightwallet-next vs golden %s', (file) => {
  const golden = loadGolden(file);

  it('reproduces the scrypt pwDerivedKey', async () => {
    const ks = await createVault(golden.vault.input);
    const key = await deriveKey(ks, golden.kdf.password, golden.kdf.salt);
    expect(Buffer.from(key).toString('hex')).toBe(golden.kdf.pwDerivedKeyHex);
  });

  it('reproduces the first five addresses and private keys', async () => {
    const ks = await createVault(golden.vault.input);
    const key = await deriveKey(ks, golden.kdf.password, golden.kdf.salt);
    ks.generateNewAddress(key, 5);
    expect(ks.getAddresses().map(to0x)).toEqual(golden.firstFiveAddresses);
    const priv = ks.getAddresses().map((a: string) => ks.exportPrivateKey(a, key));
    expect(priv).toEqual(golden.firstFivePrivateKeys);
  });

  it('reproduces signed legacy txs byte-for-byte', async () => {
    const ks = await createVault(golden.vault.input);
    const key = await deriveKey(ks, golden.kdf.password, golden.kdf.salt);
    ks.generateNewAddress(key, 5);
    for (const t of golden.signedLegacyTxs) {
      const signed = signing.signTx(ks, key, t.rawUnsigned, t.from);
      expect(`0x${signed.replace(/^0x/, '')}`).toBe(`0x${t.rawSigned.replace(/^0x/, '')}`);
    }
  });

  it('deserialize(serialize) round-trips the address set', async () => {
    const ks = await createVault(golden.vault.input);
    const key = await deriveKey(ks, golden.kdf.password, golden.kdf.salt);
    ks.generateNewAddress(key, 5);
    const rehydrated = keystore.deserialize(ks.serialize());
    expect(rehydrated.getAddresses().map(to0x)).toEqual(golden.roundTripAddresses);
  });

  it('decrypts a vault serialized by the reference implementation', async () => {
    const rehydrated = keystore.deserialize(golden.vault.serialized);
    const key = await deriveKey(rehydrated, golden.kdf.password, golden.kdf.salt);
    expect(rehydrated.getSeed(key)).toBe(golden.vault.input.mnemonic);
  });
});
