/**
 * Golden-fixture generator (Phase 2, T2-3 / T2-4).
 *
 * Runs the ORIGINAL eth-lightwallet against fixed inputs and records the
 * deterministic outputs the modernized library must reproduce. Run twice:
 *
 *   node scripts/generate-goldens.mjs --version 3.0.1 \
 *     --lib ./node_modules/eth-lightwallet
 *   node scripts/generate-goldens.mjs --version 4.0.0 \
 *     --lib ../eth-lightwallet/legacy   (or the frozen 4.0.0 path)
 *
 * Deterministic pins: pwDerivedKey (scrypt), derived addresses, private keys,
 * and signed legacy txs. Ciphertext is nonce-random, so the serialized vault
 * is recorded for shape/decryptability, not byte equality.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));

// ---- CLI args -------------------------------------------------------------
function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}
const version = arg('version', null);
const libPath = arg('lib', './node_modules/eth-lightwallet');
const outPath = arg(
  'out',
  resolve(here, `../test/goldens/eth-lightwallet/vault-${version}.json`),
);
if (!version) {
  console.error('usage: generate-goldens.mjs --version <v> [--lib path] [--out path]');
  process.exit(2);
}

// ---- Fixed inputs (mirror t-11d7's generator so pins are comparable) ------
const PASSWORD = 'golden-test-password-1';
const SALT = 'golden-fixed-salt-1';
const MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const HD_PATH = "m/0'/0'/0'";
const N_ADDRESSES = 5;

// --lib may point at a package (with package.json main) or a bare directory
// of CJS modules (e.g. the fork's frozen legacy/ tree, which has index.js but
// no package.json). Resolve the entry file explicitly to handle both.
function resolveLib(p) {
  const abs = resolve(here, '..', p);
  try {
    // package dir or package name
    return require.resolve(abs);
  } catch {
    // bare dir with index.js
    return require.resolve(`${abs}/index.js`);
  }
}
const lw = require(resolveLib(libPath));
const { keystore, txutils, signing } = lw;

// 3.0.1 getAddresses() returns 0x-prefixed; the serialized vault stores bare.
// Normalize to a single canonical 0x-prefixed form for comparison with the
// 4.0.0 goldens (which store 0x-prefixed in firstFiveAddresses).
function to0x(addr) {
  return addr.startsWith('0x') ? addr : `0x${addr}`;
}

function createVaultPromise() {
  return new Promise((res, rej) => {
    const opts = {
      password: PASSWORD,
      seedPhrase: MNEMONIC,
      salt: SALT,
      hdPathString: HD_PATH,
    };
    keystore.createVault(opts, (err, ks) => (err ? rej(err) : res(ks)));
  });
}

function keyFromPasswordPromise(ks) {
  return new Promise((res, rej) => {
    // 3.0.1 exposes deriveKeyFromPasswordAndSalt via createVault's ks; some
    // builds name it keyFromPassword. Use whichever the instance has.
    const fn =
      typeof ks.keyFromPassword === 'function'
        ? ks.keyFromPassword.bind(ks)
        : null;
    if (!fn) {
      // fall back to the module-level KDF with the vault's salt
      keystore.deriveKeyFromPasswordAndSalt(
        PASSWORD,
        ks.salt ?? SALT,
        (err, key) => (err ? rej(err) : res(key)),
      );
      return;
    }
    fn(PASSWORD, (err, key) => (err ? rej(err) : res(key)));
  });
}

// NOTE (behavioral divergence, documented in plan §9): 3.0.1's txutils.valueTx
// DROPS txObject.data (it never copies it); 4.0.0's createTx passes data
// through. To keep the cross-version comparison meaningful, these fixtures use
// data-free value txs (identical semantics on both). Data-bearing contract
// calls in the app go through web3.eth.sendTransaction / contract.transfer,
// NOT txutils — verified: no app code imports txutils. Data-field signing is
// covered separately via functionTx-style txs in the Anvil comparison suite.
function signTxs(ks, pwDerivedKey, addresses) {
  const from = addresses[0];
  const txs = [
    {
      name: 'eth-transfer',
      build: () =>
        txutils.valueTx({
          to: '0x0000000000000000000000000000000000000001',
          value: '0x01',
          gasLimit: '0x5208',
          gasPrice: '0x04a817c800',
          nonce: '0x00',
        }),
    },
    {
      name: 'eth-transfer-larger',
      build: () =>
        txutils.valueTx({
          to: '0x0000000000000000000000000000000000000002',
          value: '0x0de0b6b3a7640000',
          gasLimit: '0x5208',
          gasPrice: '0x0ba43b7400',
          nonce: '0x01',
        }),
    },
    {
      name: 'eth-transfer-higher-nonce',
      build: () =>
        txutils.valueTx({
          to: '0x0000000000000000000000000000000000000003',
          value: '0x16345785d8a0000',
          gasLimit: '0x5208',
          gasPrice: '0x04a817c800',
          nonce: '0x2a',
        }),
    },
  ];
  return txs.map((t) => {
    const rawUnsigned = t.build();
    const rawSigned = signing.signTx(ks, pwDerivedKey, rawUnsigned, from);
    return { name: t.name, from, rawUnsigned, rawSigned };
  });
}

async function main() {
  const ks = await createVaultPromise();
  const pwDerivedKey = await keyFromPasswordPromise(ks);
  const pwDerivedKeyHex = Buffer.from(pwDerivedKey).toString('hex');

  // first address set
  ks.generateNewAddress(pwDerivedKey, N_ADDRESSES);
  const addresses = ks.getAddresses().map(to0x);
  const privateKeys = ks.getAddresses().map((a) => ks.exportPrivateKey(a, pwDerivedKey));

  const serialized = ks.serialize();
  // signTx strips the 0x internally; pass the bare form to match the vault.
  const signedLegacyTxs = signTxs(ks, pwDerivedKey, addresses);

  // round-trip check
  const rehydrated = keystore.deserialize(serialized);
  const roundTrip = rehydrated.getAddresses().map(to0x);

  const golden = {
    provenance: {
      generator: `eth-lightwallet@${version} via ${libPath}`,
      generatedAt: new Date().toISOString().slice(0, 10),
      node: process.version,
      repo: 'gkgoat1/eth-hot-wallet',
    },
    kdf: {
      algorithm: 'scrypt',
      params: { logN: 14, r: 8, p: 1, dkLen: 32 },
      password: PASSWORD,
      salt: SALT,
      pwDerivedKeyHex,
    },
    vault: {
      input: { mnemonic: MNEMONIC, password: PASSWORD, salt: SALT, hdPathString: HD_PATH },
      serialized,
      decryptedSeed: MNEMONIC,
      hdIndexAfter: N_ADDRESSES,
    },
    firstFiveAddresses: addresses,
    firstFivePrivateKeys: privateKeys,
    signedLegacyTxs,
    roundTripAddresses: roundTrip,
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(golden, null, 2)}\n`);
  console.log(`wrote ${outPath}`);
  console.log(`  pwDerivedKey: ${pwDerivedKeyHex}`);
  console.log(`  addresses[0]: ${addresses[0]}`);
  console.log(`  signed tx[0] len: ${signedLegacyTxs[0].rawSigned.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
