import { defineConfig } from 'vitest/config';

// Anvil integration tests. Requires the foundry toolchain on PATH
// (fail-closed otherwise — see test/anvil.ts). Runs as its own CI job.
export default defineConfig({
  test: {
    include: ['test/anvil/**/*.test.{ts,js}'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
