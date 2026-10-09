# Phase 6 summary — Framework upgrades

**Plan:** [2026-02-11-modernization-plan.md](./2026-02-11-modernization-plan.md) §4 Phase 6 / §7
**Branch:** `modernize/phase-6-framework` (pushed to `gkgoat1/eth-hot-wallet`)
**Date:** 2026-02-11 · **Status:** complete

## Headline

The app runs on a modern framework stack: **React 18**, **react-redux 8**, **redux 5 +
Redux Toolkit**, **react-router-dom 6**, **antd 5**, **styled-components 6** — with the
**immutable / redux-immutable / react-router-redux** stack fully removed (plain JS state).
`tsc --noEmit` reports **0 errors project-wide** (strict, app/** included).

## What changed

| Area | Before | After |
| --- | --- | --- |
| React | 15.7 | 18.3 (`createRoot`) |
| react-redux | 5.1 | 8.1 |
| redux | 3.7 | 5.0 + RTK 2 (`configureStore`) |
| router | react-router-dom 4 + react-router-redux | react-router-dom 6 (`Routes`/`element`) |
| state shape | immutable / redux-immutable | plain JS objects (RTK) |
| UI | antd 3.26 | antd 5.29 (+ @ant-design/icons 5) |
| styled-components | 2.4 (`injectGlobal`) | 6.5 (`createGlobalStyle`) |
| injectors | legacy `contextTypes` class HOCs | hooks (`useStore`/`useEffect`) |

## How

Sequential subsystem migrations, each committed green, plus a 4-agent + verify
`phase6-immutable-removal` workflow (kimi-k3:high) for the immutable->plain conversion.

## Latent bugs fixed (plan §9), regression-tested

- `Header/saga` network-change address wipe (`updateTokenInfo(keystore.getAddresses, …)`)
  — method reference + undefined tokenInfo -> empty addressMap. Fixed + regression test.
- `CheckBalancesStatus` template-literal `+` leftover.
- `CurrencySelector` `<option value={false}>` -> string `"false"` coercion.

## Tooling note

Recurring pi-lens "App/index.tsx Routes/Route" findings were stale-cache false positives:
pi-lens's tsserver resolved `@types/react@16/19` from the global TypeScript typings cache
(`~/Library/Caches/typescript`) instead of the project's pinned `@18.3.31`. Cleared the
global cache; the authoritative gates (`tsc --noEmit`, TS compiler API) report 0 errors.

## Verification

- `pnpm typecheck` 0 errors (strict, app/** included)
- `pnpm exec vite build` green
- `pnpm test` 23 passed + 10 skipped (legacy 3.0.1 golden reference skips by design)
- `pnpm test:anvil` 5/5
- `pnpm lint` 0 errors
- Zero `immutable` / `redux-immutable` / `react-router-redux` imports remain in app/**

## Still open (Phase 7)

- Publish `@eth-hot-wallet/web3-adapter`; switch `eth-lightwallet-next` git dep to published
  `@gkgo/eth-lightwallet` once npm resolves it; changesets; remove dead legacy tooling
  (`internals/` webpack/babel/jest configs).
