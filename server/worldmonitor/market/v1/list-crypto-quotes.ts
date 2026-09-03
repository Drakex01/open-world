/**
 * RPC: ListCryptoQuotes -- reads seeded crypto data from Railway seed cache.
 * All external CoinGecko calls happen in ais-relay.cjs on Railway.
 */

import type {
  ServerContext,
  ListCryptoQuotesRequest,
  ListCryptoQuotesResponse,
  CryptoQuote,
} from '../../../../src/generated/server/cyberspace/market/v1/service_server';
import { CRYPTO_META, parseStringArray, fetchCryptoMarkets, type CoinGeckoMarketItem } from './_shared';
import { getCachedJson, setCachedJson } from '../../../_shared/redis';

const SEED_CACHE_KEY = 'market:crypto:v1';
const FALLBACK_TTL_S = 300;

function toCryptoQuote(item: CoinGeckoMarketItem): CryptoQuote {
  return {
    symbol: item.symbol?.toUpperCase() || '',
    name: item.name || '',
    price: item.current_price || 0,
    change: item.price_change_percentage_24h || 0,
    change7d: item.price_change_percentage_7d_in_currency || 0,
    sparkline: item.sparkline_in_7d?.price || [],
  };
}

const SYMBOL_TO_ID = new Map(Object.entries(CRYPTO_META).map(([id, m]) => [m.symbol, id]));

export async function listCryptoQuotes(
  _ctx: ServerContext,
  req: ListCryptoQuotesRequest,
): Promise<ListCryptoQuotesResponse> {
  const parsedIds = parseStringArray(req.ids);
  const ids = parsedIds.length > 0 ? parsedIds : Object.keys(CRYPTO_META);

  try {
    const seedData = await getCachedJson(SEED_CACHE_KEY, true) as { quotes: CryptoQuote[] } | null;
    if (!seedData?.quotes?.length) {
      // Local dev mode fallback
      const cacheKey = `market:crypto-fallback:${ids.join(',')}`;
      const cached = await getCachedJson(cacheKey, true) as { quotes: CryptoQuote[] } | null;
      if (cached?.quotes?.length) return cached;
      
      const cgData = await fetchCryptoMarkets(ids);
      const quotes = cgData.map(toCryptoQuote);
      if (quotes.length > 0) {
        void setCachedJson(cacheKey, { quotes }, FALLBACK_TTL_S, true);
        return { quotes };
      }
      return { quotes: [] };
    }

    const allIds = new Set(ids);
    const filtered = allIds.size === 0
      ? seedData.quotes
      : seedData.quotes.filter((q) => allIds.has(SYMBOL_TO_ID.get(q.symbol) ?? ''));

    return { quotes: filtered };
  } catch (err) {
    return { quotes: [] };
  }
}
