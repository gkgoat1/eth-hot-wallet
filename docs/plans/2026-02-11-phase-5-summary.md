# Phase 5 summary — App TS migration

**Plan:** [2026-02-11-modernization-plan.md](./2026-02-11-modernization-plan.md) §4 Phase 5 / §6
**Branch:** `modernize/phase-5-app-ts` (pushed to `gkgoat1/eth-hot-wallet`)
**Date:** 2026-02-11 · **Status:** complete

## Headline

The app builds on the modern toolchain — **vite** (webpack 3 gone), **TypeScript strict**
(`tsc --noEmit` = 0 errors across `app/**`, `packages/**`, `test/**`) — and runs the
**modernized keystore** (`@gkgo/eth-lightwallet` v5.0.0 via git dep) and the **viem-based
`@eth-hot-wallet/web3-adapter`** (web3 0.20 + vendored webpack-UMD signer removed).

## What changed

| Area | Before | After |
| --- | --- | --- |
| Build | webpack 3 + babel 6 + DLL | vite 6 (`vite.config.ts`, root=app, aliases preserved) |
| Language | ES6+JSX via babel | TypeScript strict, `.ts/.tsx`; **0 tsc errors** |
| Keystore | npm `eth-lightwallet@3.0.1` | `eth-lightwallet-next` → fork v5.0.0 (`8e263dd`), golden-gated |
| Chain I/O | web3 0.20 + `vendor/ethjs-provider-signer` | `@eth-hot-wallet/web3-adapter` (viem), anvil-tested |
| Assets | `!file-loader` imports | `app/public/` (vite verbatim) |
| Tests | jest 20 + enzyme (dead) | vitest; goldens + anvil + unit regression tests |

## How it was done

Two background workflows (`kimi-k3:high`): a 9-agent port (no-behavior-change rule, JSX
byte-identical) + verify; then a 6-agent strict cleanup (type-level-only) + verify.
tsc errors went 459 → 281 (types + react-intl stub) → **0**.

## Latent bugs found & fixed (plan §9; each regression-tested or documented)

1. **`Header/saga` network-change address wipe** — `updateTokenInfo(keystore.getAddresses,
   action.tokenInfo)` passed a method reference (arity 0 → empty addressMap) + undefined
   tokenInfo. Fixed (`getAddresses()`, `{}`); regression test
   `test/unit/header-saga-network-change.test.ts`.
2. **`CheckBalancesStatus`** — `balances checked on  + <time>` template leftover. Fixed.
3. **`CurrencySelector`** — `<option value={false}>` coerced to string `"false"`. Fixed to
   `value=""` sentinel.
4. **react-intl never a dependency** — i18n disabled app-wide; aliased to
   `app/utils/react-intl-stub.tsx` (identity `defineMessages`, `FormattedMessage` renders
   defaultMessage). bignumber.js@9 `toPower`→`pow` drift fixed in `unitConverter`.

Documented-not-fixed (deferred to Phase 6 framework work): CoinMarketCap v1 rates API is
defunct (fails into the saga's error path, has dummyRates fallback), antd 3 / React 15
component guard inconsistencies, `componentWillMount`/`contextTypes` in the injectors.

## Verification

- `pnpm exec vite build` green
- `pnpm typecheck` 0 errors (strict, app/** included)
- `pnpm test` 23 passed + 10 skipped (legacy 3.0.1 golden reference skips by design post-flip)
- `pnpm test:anvil` 5/5 (golden tx + adapter signed ETH/ERC-20 sends on-chain)
- `pnpm lint` 0 errors

## Still open (Phase 6)

- React 15 → 18, redux-immutable → RTK, react-router-redux 4 → router v6, antd 3 → 5,
  styled-components 2 → 6 (plan §7).
- Remove dead legacy tooling (webpack/babel/jest configs under `internals/`, old scripts).
- Phase 7: switch `eth-lightwallet-next` git dep → published `@gkgo/eth-lightwallet` on npm
  once the registry resolves it.
