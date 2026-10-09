import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

// Modern test runner for the migration. Legacy jest tests under app/**/tests
// stay on jest until ported (Phase 5); vitest only picks up test/** and
// packages/** so the two never collide.
export default defineConfig({
  resolve: {
    // mirror vite.config.ts aliases so tests importing app/** resolve
    alias: {
      components: resolve(__dirname, 'app/components'),
      containers: resolve(__dirname, 'app/containers'),
      utils: resolve(__dirname, 'app/utils'),
      vendor: resolve(__dirname, 'app/vendor'),
    },
  },
  test: {
    include: ['test/**/*.test.{ts,tsx,js}', 'packages/**/*.test.{ts,tsx}'],
    // anvil tests require the foundry toolchain and run in their own job
    // (`pnpm test:anvil`); the default unit-test run excludes them so CI
    // and bare checkouts stay green without foundry installed.
    exclude: ['test/anvil/**', '**/node_modules/**'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
