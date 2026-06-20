/**
 * RPC: ListMarketQuotes -- reads seeded stock/index data from Railway seed cache.
 * All external Finnhub/Yahoo Finance calls happen in ais-relay.cjs on Railway.
 */

import type {
  ServerContext,
  ListMarketQuotesRequest,
  ListMarketQuotesResponse,
  MarketQuote,
} from '../../../../src/generated/server/cyberspace/market/v1/service_server';
import { parseStringArray } from './_shared';
import { getCachedJson, setCachedJson } from '../../../_shared/redis';

const BOOTSTRAP_KEY = 'market:stocks-bootstrap:v1';
const YAHOO_FALLBACK_TTL_S = 300; // 5 mins

async function fetchYahooQuote(symbol: string): Promise<MarketQuote | null> {
  try {
    const yfSymbol = symbol === 'DJI' ? '^DJI' : symbol === 'SPX' ? '^GSPC' : symbol === 'COMP' ? '^IXIC' : symbol === 'VIX' ? '^VIX' : symbol === 'NDX' ? '^NDX' : symbol === 'RUT' ? '^RUT' : symbol;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yfSymbol}?interval=1d&range=5d`;
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

export async function listMarketQuotes(
  _ctx: ServerContext,
  req: ListMarketQuotesRequest,
): Promise<ListMarketQuotesResponse> {
  const parsedSymbols = parseStringArray(req.symbols);

  try {
    const bootstrap = await getCachedJson(BOOTSTRAP_KEY, true) as ListMarketQuotesResponse | null;
    if (!bootstrap?.quotes?.length) {
      // Local dev mode fallback: if no seed data, fetch directly from Yahoo Finance
      if (parsedSymbols.length > 0) {
        // Check sidecar cache for individual symbols first (prevent rate limits if rapidly refreshing)
        const quotes: MarketQuote[] = [];
        const missingSymbols: string[] = [];
        
        for (const symbol of parsedSymbols) {
          const cacheKey = `market:yf-fallback:${symbol}`;
          const cached = await getCachedJson(cacheKey, true) as MarketQuote | null;
          if (cached) {
            quotes.push(cached);
          } else {
            missingSymbols.push(symbol);
          }
        }
        
        // Fetch missing symbols from Yahoo concurrently
        if (missingSymbols.length > 0) {
          const fetched = await Promise.all(missingSymbols.map(fetchYahooQuote));
          for (let i = 0; i < fetched.length; i++) {
            const quote = fetched[i];
            const symbol = missingSymbols[i];
            if (quote) {
              quotes.push(quote);
              if (symbol) {
                void setCachedJson(`market:yf-fallback:${symbol}`, quote, YAHOO_FALLBACK_TTL_S, true);
              }
            }
          }
        }
        
        return { quotes, finnhubSkipped: false, skipReason: '', rateLimited: false };
      }
      return { quotes: [], finnhubSkipped: false, skipReason: '', rateLimited: false };
    }

    if (parsedSymbols.length > 0) {
      const symbolSet = new Set(parsedSymbols);
      const filtered = bootstrap.quotes.filter((q: MarketQuote) => symbolSet.has(q.symbol));
      return { quotes: filtered, finnhubSkipped: false, skipReason: '', rateLimited: false };
    }

    return bootstrap;
  } catch {
    return { quotes: [], finnhubSkipped: false, skipReason: '', rateLimited: false };
  }
}
