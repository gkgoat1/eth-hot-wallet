# Phase 1 summary — Groundwork

**Plan:** [2026-02-11-modernization-plan.md](./2026-02-11-modernization-plan.md) §4 Phase 1
**Branch:** `modernize/phase-1-groundwork` (pushed to `gkgoat1/eth-hot-wallet`)
**Date:** 2026-02-11 · **Status:** complete, CI green

## What changed

| Commit | Change |
| --- | --- |
| `ae1ba02` | docs: add modernization plan |
| `3d1f27a` | build: migrate yarn → pnpm (lockfile import, exotic-subdep override, allowBuilds) |
| `d47436b` | docs: correct crypto facts per t-11d7 (tweetnacl secretbox, scrypt logN=14, pre-EIP-155) |
| `c5a186d` | ci+test: GitHub Actions, eslint 9 flat, vitest, anvil harness |
| `682a357` | fix(ci): split anvil job, drop legacy postinstall DLL hook |

## Headline

The repo now installs and tests on Node 26 + pnpm with a green CI that proves two things at
once: the **original `eth-lightwallet@3.0.1` stack still works** (vault create → address
derivation → legacy signed tx, natives `secp256k1`/`keccak` built), and the **modern harness
is in place** (vitest, eslint 9 flat, tsc strict, Anvil integration job).

## What it means

* **Toolchain unblocked.** pnpm@11.8.0 pinned via `packageManager`; `pnpm-lock.yaml`
  imported from `yarn.lock` with `eth-lightwallet@3.0.1` keeping its sha512 pin. web3
  0.20.7's git-resolved `bignumber.js` fork is pinned to npm 9.0.1 via an override.
* **Two test worlds, cleanly separated.** Legacy jest/enzyme tests under `app/**/tests` stay
  on jest until Phase 5; vitest owns `test/**` + `packages/**`. Anvil tests run in their own
  CI job with `foundry-toolchain`, fail-closed if the binary is missing.
* **Legacy build untouched but no longer blocking.** `postinstall: build:dll` removed (it
  ran webpack 3 during install and broke under pnpm's isolated `node_modules`); the DLL
  build is still available as an explicit legacy step until Phase 5 replaces the build.

## Defects found & fixed this phase

1. **pnpm 11 `pnpm.overrides` ignored in package.json** — moved to `pnpm-workspace.yaml`
   `overrides:`; `blockExoticSubdeps: false` + `allowBuilds` map for native/postinstall
   scripts (`secp256k1`, `keccak`, `esbuild`, …).
2. **CI unit-test job ran anvil tests without foundry** — split configs
   (`vitest.config.ts` excludes `test/anvil/**`; `vitest.anvil.config.ts` includes it).
3. **Anvil `--silent` suppresses the `Listening on` line** — harness parses stdout+stderr
   without `--silent`; `--port 0` free-port + `eth_chainId` readiness.

## Still open (next phases)

* **Phase 2 — Golden capture.** Generate oracle fixtures from the verified original code
  (npm 3.0.1 + fork 4.0.0) into `test/goldens/**`; copy t-11d7's
  `test/golden/generated/vault-4.0.0.json` (branch `modernize`, HEAD `87995a8`) as the
  shared acceptance fixture; fill appendix A digests.
* **Phase 3 — `eth-lightwallet` Git dependency.** Pin `eth-lightwallet-next:
  github:gkgoat1/eth-lightwallet#<sha>` once t-11d7 ships a dual ESM/CJS artifact; keep npm
  3.0.1 until the golden+Anvil gate passes.
* **Phase 4+** — `packages/web3-adapter` (viem), then app TS migration.

## Verification

Local: `pnpm install` clean · `pnpm test` 2/2 · `pnpm test:anvil` 3/3 · `pnpm lint` 0 ·
`pnpm typecheck` 0 · keystore smoke OK.
CI: `install`, `lint`, `typecheck`, `anvil integration` green on the branch; `unit tests`
fixed by `682a357`; `legacy webpack build` intentionally `continue-on-error`.
