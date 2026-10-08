import { defineConfig } from 'vitest/config';

// Package-local vitest: unit tests by default; anvil tests need foundry.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    exclude: ['test/anvil.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
  },
});
