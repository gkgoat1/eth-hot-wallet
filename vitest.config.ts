import { defineConfig } from 'vitest/config';

// Modern test runner for the migration. Legacy jest tests under app/**/tests
// stay on jest until ported (Phase 5); vitest only picks up test/** and
// packages/** so the two never collide.
export default defineConfig({
  test: {
    include: ['test/**/*.test.{ts,js}', 'packages/**/*.test.{ts,tsx}'],
    // anvil tests require the foundry toolchain and run in their own job
    // (`pnpm test:anvil`); the default unit-test run excludes them so CI
    // and bare checkouts stay green without foundry installed.
    exclude: ['test/anvil/**', '**/node_modules/**'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
