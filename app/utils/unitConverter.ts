import BigNumber from 'bignumber.js';

// limit precision for inverse
BigNumber.config({ POW_PRECISION: 10 });

interface RatePath {
  symbol?: string;
  key?: string;
  isInverse?: boolean;
  const?: number;
}

interface RateMapEntry {
  path: RatePath;
  path2?: RatePath;
  isInverse?: boolean;
  name: string;
}

type RatesMap = Record<string, RateMapEntry>;

export interface ApiRate {
  symbol?: string;
  [key: string]: unknown;
}

export interface ExtractedRate {
  name: string;
  rate: BigNumber;
}

/* map to generate conversion rate for each currency; path = place in object */
const ratesMaps: Record<string, RatesMap> = {
  'https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=EUR': {
    eth_eth: { path: { const: 1 }, isInverse: false, name: 'ETH' },
    eth_usd: { path: { symbol: 'eth', key: 'price_usd' }, name: 'USD' },
    eth_btc: { path: { symbol: 'eth', key: 'price_btc' }, name: 'BTC' },
    eth_eur: { path: { symbol: 'eth', key: 'price_eur' }, name: 'EURO' },
  },

  'https://api.coinmarketcap.com/v1/ticker/?convert=EUR': {
    eth_eth: { path: { const: 1 }, name: 'ETH' },
    eth_usd: { path: { symbol: 'eth', key: 'price_usd' }, name: 'USD' },
    eth_btc: { path: { symbol: 'eth', key: 'price_btc' }, name: 'BTC' },
    eth_eur: { path: { symbol: 'eth', key: 'price_eur' }, name: 'EURO' },
    eth_eos: {
      // to get eth_eos: eth_usd * usd_eos
      name: 'EOS',
      path: { symbol: 'eth', key: 'price_usd', isInverse: false },
      path2: { symbol: 'eos', key: 'price_usd', isInverse: true },
    },
  },
};

/**
 * Adds a double path (eth_usd then usd_token) for every token, producing the
 * eth_token rate.
 */
const addPathsForTokens = (ratesMap: RatesMap, tokenList: string[]): RatesMap => {
  const resultMap = ratesMap;
  tokenList.forEach((token) => {
    if (token === 'eth') return;
    resultMap[`eth_${token}`] = {
      name: token,
      path: { symbol: 'eth', key: 'price_usd', isInverse: false },
      path2: { symbol: token, key: 'price_usd', isInverse: true },
    };
  });
  return resultMap;
};

/**
 * Get value from inside the object according to a path: search the symbol in
 * the list, then read the key, inverting if needed.
 */
const getRate = (tokenList: ApiRate[], path: RatePath): BigNumber | null => {
  if (path.const) {
    return new BigNumber(path.const);
  }
  const isSymbol = (element: ApiRate) =>
    Boolean(element.symbol) && element.symbol!.toLowerCase() === path.symbol;

  const target = tokenList.find(isSymbol);
  if (target && path.key) {
    const value = new BigNumber(target[path.key] as string | number);
    // bignumber.js@9 renamed toPower -> pow (exponentiatedBy). -1 => inverse.
    return path.isInverse ? value.pow(-1) : value;
  }
  return null;
};

/**
 * Extract api rates into a map keyed eth_x where x is a currency symbol.
 */
export default function extractRates(
  apiRates: ApiRate[],
  requestUrl: string,
  tokenList: string[],
): Record<string, ExtractedRate> {
  let ratesMap = ratesMaps[requestUrl];
  if (!ratesMap) {
    return {};
  }
  ratesMap = addPathsForTokens(ratesMap, tokenList);
  const rates: Record<string, ExtractedRate> = {};

  Object.keys(ratesMap).forEach((key) => {
    const rate1 = getRate(apiRates, ratesMap[key].path);
    // 2 conversions might be needed to get eth_token rate:
    const rate2 = ratesMap[key].path2 && getRate(apiRates, ratesMap[key].path2!);
    if (rate1 && !ratesMap[key].path2) {
      rates[key] = { name: ratesMap[key].name, rate: rate1 };
    }
    if (rate1 && rate2) {
      rates[key] = { name: ratesMap[key].name, rate: rate1.times(rate2) };
    }
  });
  return rates;
}
