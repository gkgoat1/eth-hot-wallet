# Phase 2 summary — Golden capture

**Plan:** [2026-02-11-modernization-plan.md](./2026-02-11-modernization-plan.md) §4 Phase 2
**Branch:** `modernize/phase-2-goldens` (pushed to `gkgoat1/eth-hot-wallet`)
**Date:** 2026-02-11 · **Status:** complete, all gates green

## Headline

Oracle fixtures for the keystore are now captured from the **verified original code** and
locked into the repo. 3.0.1 and 4.0.0 produce **byte-identical** deterministic pins, and the
reference-signed legacy transactions execute on a local Anvil chain (receipt `0x1`). The
acceptance gate for the modernized `eth-lightwallet` is in place and runnable.

## What changed

| Commit | Change |
| --- | --- |
| `db04874` | import fork 4.0.0 goldens (shared fixture, provenance recorded) |
| `8839167` | golden generator + 3.0.1/4.0.0 fixtures |
| `4721ddf` | golden test harness + anvil tx execution |

Plus appendix A filled (npm 3.0.1 tarball sha512 MATCH).

## Deliverables

* **`scripts/generate-goldens.mjs`** — rerunnable generator; `--version`/`--lib` select the
  oracle (npm-installed 3.0.1, or the fork's frozen `legacy/` 4.0.0 tree).
* **`test/goldens/eth-lightwallet/vault-{3.0.1,4.0.0}.json`** — pinned: scrypt pwDerivedKey
  (`ac0979cf…`, logN=14/r=8/p=1/dkLen=32), first-5 addresses + private keys, 3 signed legacy
  txs (v=27), serialize/deserialize round-trip. Cross-version equivalent.
* **`test/goldens/keystore.test.ts`** — 10 vitest tests recompute the installed lib against
  both goldens; includes forward-compat (decrypt a reference-serialized vault). Becomes the
  Phase 3 gate when pointed at `eth-lightwallet-next`.
* **`test/anvil/golden-tx.test.ts`** — submits a reference-signed legacy tx to Anvil
  (`anvil_setBalance` → `eth_sendRawTransaction` → `evm_mine`), asserts receipt `0x1` and
  exact value transfer.

## What it means

The "preserve functionality" promise is now testable, not aspirational: any candidate
modernized keystore must reproduce these pins byte-for-byte **and** produce chain-valid
signatures. Both the byte-stability and the chain-validity properties are covered.

## Defects found & fixed this phase

1. **3.0.1 `txutils.valueTx` drops `data`** — silently discards `txObject.data`; 4.0.0
   preserves it. Recorded in plan §9a; goldens use data-free value txs (the app never calls
   `txutils`, so no runtime impact).
2. **Precompile recipient footgun** — value transfer to `0x01`–`0x09` executes the
   precompile and OOGs at 21000 gas. Golden recipients moved to `0x1000…00{1,2,3}`.
3. **Golden generator double-`0x` bug** — 3.0.1 `getAddresses()` already returns
   `0x`-prefixed; normalized.
4. **Stale pi-lens TS server** — cleared the wedged `lsp-workspace-diagnostics.json` cache;
   fresh probe confirms the toolchain files are clean (the recurring "cannot find vitest"
   findings were stale-cache false positives, not code issues).

## Cross-session

t-11d7 (`gkgoat1/eth-lightwallet@modernize`) has a buildable dual ESM/CJS artifact at
`298169e` and flagged a signing finding (legacy message-sig nonce isn't byte-stable). Decision
recorded: strict-RFC6979 for `signMsg`, tx signing stays byte-pinned; goldens assert
validity+recovery for messages, byte-exactness for txs.

## Verification

`pnpm typecheck` 0 · `pnpm test` 12/12 · `pnpm test:anvil` 5/5 · `pnpm lint` 0 ·
3.0.1↔4.0.0 pins equivalent · golden tx executes on-chain.

## Still open

* **Phase 3 — wire `eth-lightwallet-next`** Git dep (pin `298169e` now for early integration,
  advance to t-11d7's Phase-3 sha for the clean-deps gate). Keep npm 3.0.1 until goldens +
  Anvil pass against the new lib.
* **Phase 4** — `packages/web3-adapter` (viem).
