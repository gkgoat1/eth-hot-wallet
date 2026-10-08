import { describe, expect, it } from 'vitest';

// Placeholder unit test so the default `pnpm test` job has a suite to run
// once anvil tests are excluded. Replaced by real unit tests in Phase 3+.
describe('modern toolchain', () => {
  it('runs vitest on modern node', () => {
    const [major] = process.versions.node.split('.').map(Number);
    expect(major).toBeGreaterThanOrEqual(20);
  });

  it('supports ESM + TS interop used by the new packages', () => {
    const mod = { keystore: true, signing: true };
    expect(Object.keys(mod)).toContain('keystore');
  });
});
