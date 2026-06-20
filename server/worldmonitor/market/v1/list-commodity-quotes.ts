/**
 * RPC: ListCommodityQuotes -- reads seeded commodity data from Railway seed cache.
 * All external Yahoo Finance calls happen in ais-relay.cjs on Railway.
 */

import type {
  ServerContext,
  ListCommodityQuotesRequest,
  ListCommodityQuotesResponse,
  CommodityQuote,
} from '../../../../src/generated/server/cyberspace/market/v1/service_server';
import { parseStringArray } from './_shared';
import { getCachedJson, setCachedJson } from '../../../_shared/redis';

const BOOTSTRAP_KEY = 'market:commodities-bootstrap:v1';
const YAHOO_FALLBACK_TTL_S = 300; // 5 mins

async function fetchYahooQuote(symbol: string): Promise<CommodityQuote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) return null;
    const data = await resp.json() as any;
    const result = data.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = price && previousClose ? price - previousClose : 0;
    
    // Attempt to extract sparkline
    const sparkline = result.indicators?.quote?.[0]?.close || [];
    const filteredSparkline = sparkline.filter((v: any) => typeof v === 'number');

    return {
      symbol,
      name: meta.shortName || symbol,
      display: symbol,
      price: price || 0,
      change: change || 0,
      sparkline: filteredSparkline.slice(-20),
    };
  } catch (e) {
    return null;
  }
}

export async function listCommodityQuotes(
  _ctx: ServerContext,
  req: ListCommodityQuotesRequest,
): Promise<ListCommodityQuotesResponse> {
  const symbols = parseStringArray(req.symbols);
  if (!symbols.length) return { quotes: [] };

  try {
    const bootstrap = await getCachedJson(BOOTSTRAP_KEY, true) as ListCommodityQuotesResponse | null;
    if (!bootstrap?.quotes?.length) {
      // Local dev mode fallback: if no seed data, fetch directly from Yahoo Finance
      const quotes: CommodityQuote[] = [];
      const missingSymbols: string[] = [];
      
      for (const symbol of symbols) {
        const cacheKey = `market:yf-fallback:commodity:${symbol}`;
        const cached = await getCachedJson(cacheKey, true) as CommodityQuote | null;
        if (cached) {
          quotes.push(cached);
        } else {
          missingSymbols.push(symbol);
        }
      }
      
      if (missingSymbols.length > 0) {
        const fetched = await Promise.all(missingSymbols.map(fetchYahooQuote));
        for (let i = 0; i < fetched.length; i++) {
          const quote = fetched[i];
          const symbol = missingSymbols[i];
          if (quote) {
            quotes.push(quote);
            if (symbol) {
              void setCachedJson(`market:yf-fallback:commodity:${symbol}`, quote, YAHOO_FALLBACK_TTL_S, true);
            }
          }
        }
      }
      return { quotes };
    }

    const symbolSet = new Set(symbols);
    const filtered = bootstrap.quotes.filter((q: CommodityQuote) => symbolSet.has(q.symbol));
    return { quotes: filtered };
  } catch {
    return { quotes: [] };
  }
}
