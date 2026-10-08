import { defineConfig } from 'vitest/config';

// Anvil integration tests (keystore-signed ETH + ERC-20 sends). Requires the
// foundry toolchain on PATH (fail-closed via test/anvil.ts).
export default defineConfig({
  test: {
    include: ['test/anvil.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
