/**
 * Smoke test: the original eth-lightwallet@3.0.1 stack must keep working
 * under the modern toolchain (Node >= 20, pnpm). Exercises scrypt KDF,
 * address derivation, and legacy tx signing (secp256k1 + keccak natives).
 * Fail-closed: any error exits non-zero.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const lw = require('eth-lightwallet');

const seed = lw.keystore.generateRandomSeed('ci-smoke');
if (seed.split(' ').length !== 12) throw new Error('bad seed');

lw.keystore.createVault(
  {
    password: 'ci-smoke',
    seedPhrase: seed,
    hdPathString: "m/0'/0'/0'",
  },
  (err, ks) => {
    if (err) throw err;
    ks.keyFromPassword('ci-smoke', (err2, pwKey) => {
      if (err2) throw err2;
      ks.generateNewAddress(pwKey, 1);
      const address = ks.getAddresses()[0];
      const tx = lw.txutils.valueTx({
        to: '0x0000000000000000000000000000000000000001',
        value: '0x01',
        gasLimit: '0x5208',
        gasPrice: '0x04a817c800',
        nonce: '0x00',
      });
      const signed = lw.signing.signTx(ks, pwKey, tx, address);
      if (!signed || signed.length < 100) {
        throw new Error('bad signed tx');
      }
      console.log('keystore smoke OK:', address);
    });
  },
);
