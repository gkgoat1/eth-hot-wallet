/**
 * Golden comparison tests (Phase 2, T2-5): the currently-installed
 * eth-lightwallet must reproduce the pinned fixtures in test/goldens/**.
 *
 * These run against whatever `eth-lightwallet` resolves to in node_modules.
 * In Phase 3 the same suite is pointed at `eth-lightwallet-next` (the
 * modernized Git dep) as the acceptance gate before the import flip.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

interface Golden {
  provenance: { generator: string; node: string };
  kdf: {
    params: { logN: number; r: number; p: number; dkLen: number };
    password: string;
    salt: string;
    pwDerivedKeyHex: string;
  };
  vault: {
    input: { mnemonic: string; password: string; salt: string; hdPathString: string };
    serialized: string;
  };
  firstFiveAddresses: string[];
  firstFivePrivateKeys: string[];
  signedLegacyTxs: Array<{ name: string; from: string; rawUnsigned: string; rawSigned: string }>;
  roundTripAddresses: string[];
}

function loadGolden(file: string): Golden {
  return JSON.parse(readFileSync(resolve(here, '../goldens/eth-lightwallet', file), 'utf8'));
}

// Parametrized over both pinned versions: the lib under test must match BOTH
// (they were proven byte-equivalent at generation time).
const GOLDEN_FILES = ['vault-3.0.1.json', 'vault-4.0.0.json'];

// This file tests the legacy npm eth-lightwallet@3.0.1 when present. After
// the Phase 5 import flip the app no longer depends on npm 3.0.1 (the
// modernized Git dep is the import); the legacy goldens then serve as the
// reference the modernized lib matches in keystore-next.test.ts. Skips
// cleanly when eth-lightwallet is not installed. Kept in a separate file from
// keystore-next because bitcore-lib's versionGuard throws if two instances
// load in one module graph (vitest isolates files into workers).
let lw: any = null;
try {
  lw = require('eth-lightwallet');
} catch {
  // npm 3.0.1 not installed (post-flip) — the legacy-reference suite skips.
}

type Lw = { keystore: any; signing: any };
const LIB: Lw | null = lw ? { keystore: lw.keystore, signing: lw.signing } : null;

const to0x = (a: string) => (a.startsWith('0x') ? a : `0x${a}`);

function createVault(lw: Lw, input: Golden['vault']['input']): Promise<any> {
  return new Promise((res, rej) =>
    lw.keystore.createVault(
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

function deriveKey(lw: Lw, ks: any, password: string, salt: string): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    if (typeof ks.keyFromPassword === 'function') {
      ks.keyFromPassword(password, (err: unknown, k: Uint8Array) => (err ? rej(err) : res(k)));
    } else {
      lw.keystore.deriveKeyFromPasswordAndSalt(
        password,
        salt,
        (err: unknown, k: Uint8Array) => (err ? rej(err) : res(k)),
      );
    }
  });
}

// describe.skipIf skips the whole suite when npm 3.0.1 is absent (post-flip).
// Inside, LIB is non-null.
const describeLegacy = LIB ? describe : describe.skip;

describeLegacy('eth-lightwallet@3.0.1 (npm)', () => {
  const lw = LIB!;

  describe.each(GOLDEN_FILES)('golden %s', (file) => {
    const golden = loadGolden(file);

    it('reproduces the scrypt pwDerivedKey', async () => {
      const ks = await createVault(lw, golden.vault.input);
      const key = await deriveKey(lw, ks, golden.kdf.password, golden.kdf.salt);
      expect(Buffer.from(key).toString('hex')).toBe(golden.kdf.pwDerivedKeyHex);
    });

    it('reproduces the first five addresses and private keys', async () => {
      const ks = await createVault(lw, golden.vault.input);
      const key = await deriveKey(lw, ks, golden.kdf.password, golden.kdf.salt);
      ks.generateNewAddress(key, 5);
      expect(ks.getAddresses().map(to0x)).toEqual(golden.firstFiveAddresses);
      const priv = ks.getAddresses().map((a: string) => ks.exportPrivateKey(a, key));
      expect(priv).toEqual(golden.firstFivePrivateKeys);
    });

    it('reproduces signed legacy txs byte-for-byte', async () => {
      const ks = await createVault(lw, golden.vault.input);
      const key = await deriveKey(lw, ks, golden.kdf.password, golden.kdf.salt);
      ks.generateNewAddress(key, 5);
      for (const t of golden.signedLegacyTxs) {
        const signed = lw.signing.signTx(ks, key, t.rawUnsigned, t.from);
        expect(`0x${signed.replace(/^0x/, '')}`).toBe(`0x${t.rawSigned.replace(/^0x/, '')}`);
      }
    });

    it('deserialize(serialize) round-trips the address set', async () => {
      const ks = await createVault(lw, golden.vault.input);
      const key = await deriveKey(lw, ks, golden.kdf.password, golden.kdf.salt);
      ks.generateNewAddress(key, 5);
      const rehydrated = lw.keystore.deserialize(ks.serialize());
      expect(rehydrated.getAddresses().map(to0x)).toEqual(golden.roundTripAddresses);
    });

    it('decrypts a vault serialized by the reference implementation', async () => {
      // Forward-compat: the recorded serialized vault (nonce-random ciphertext
      // from the reference lib) must decrypt under the lib under test.
      const rehydrated = lw.keystore.deserialize(golden.vault.serialized);
      const key = await deriveKey(lw, rehydrated, golden.kdf.password, golden.kdf.salt);
      const seed = rehydrated.getSeed(key);
      expect(seed).toBe(golden.vault.input.mnemonic);
    });
  });
});
