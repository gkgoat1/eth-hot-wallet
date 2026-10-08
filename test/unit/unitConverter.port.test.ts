import { describe, expect, it } from 'vitest';
import extractRates from '../../app/utils/unitConverter';

// Behavior-preservation check for the unitConverter JS→TS port. Expected
// values are independent literals (worked examples), not recomputed.
const ETH_API_URL = 'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR';
const MULTI_API_URL = 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR';

const ethOnly = [{ symbol: 'eth', price_usd: '300', price_btc: '0.07', price_eur: '250' }];

describe('unitConverter (TS port)', () => {
  it('extracts direct eth rates', () => {
    const r = extractRates(ethOnly, ETH_API_URL, []);
    expect(r.eth_eth.rate.toString()).toBe('1');
    expect(r.eth_usd.rate.toString()).toBe('300');
    expect(r.eth_eur.rate.toString()).toBe('250');
    expect(r.eth_eur.name).toBe('EURO');
  });

  it('computes double-path token rate (eth_usd * usd_token^-1)', () => {
    const api = [
      { symbol: 'eth', price_usd: '300' },
      { symbol: 'eos', price_usd: '5' },
    ];
    const r = extractRates(api, MULTI_API_URL, ['eos']);
    // eth_eos = 300 / 5 = 60
    expect(Number(r.eth_eos.rate.toFixed(2))).toBeCloseTo(60, 1);
  });

  it('returns {} for an unknown request URL', () => {
    expect(extractRates(ethOnly, 'https://unknown.example', [])).toEqual({});
  });
});
