import { describe, expect, it } from 'vitest';
import { parseEther, formatEther, isAddress } from '../src/index';

// Unit tests for the adapter's pure helpers (no chain, no keystore).
// Expected values are independent known literals (viem semantics), not
// recomputed from the implementation.
describe('web3-adapter unit helpers', () => {
  it('parseEther converts ether to wei', () => {
    expect(parseEther('1')).toBe(1000000000000000000n);
    expect(parseEther('0.5')).toBe(500000000000000000n);
  });

  it('formatEther converts wei to ether string', () => {
    expect(formatEther(1000000000000000000n)).toBe('1');
    expect(formatEther(1500000000000000000n)).toBe('1.5');
  });

  it('isAddress validates ethereum addresses', () => {
    expect(isAddress('0x339bc745c15d75126aba96243ea35271a5f568bf')).toBe(true);
    expect(isAddress('0xnotanaddress')).toBe(false);
    expect(isAddress('')).toBe(false);
  });
});
