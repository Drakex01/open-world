/**
 * RPC: GetSectorSummary -- reads seeded sector data from Railway seed cache.
 * All external Finnhub/Yahoo Finance calls happen in ais-relay.cjs on Railway.
 */

import type {
  ServerContext,
  GetSectorSummaryRequest,
  GetSectorSummaryResponse,
} from '../../../../src/generated/server/cyberspace/market/v1/service_server';
import { getCachedJson } from '../../../_shared/redis';

const SEED_CACHE_KEY = 'market:sectors:v2';

function getMockSectors(): GetSectorSummaryResponse {
  return {
    sectors: [
      { symbol: 'XLK', name: 'Technology', change: 1.25 },
      { symbol: 'XLF', name: 'Financials', change: -0.45 },
      { symbol: 'XLV', name: 'Health Care', change: 0.8 },
      { symbol: 'XLE', name: 'Energy', change: -1.1 },
      { symbol: 'XLC', name: 'Communication Services', change: 0.3 },
      { symbol: 'XLI', name: 'Industrials', change: -0.2 },
      { symbol: 'XLY', name: 'Consumer Discretionary', change: 0.5 },
      { symbol: 'XLP', name: 'Consumer Staples', change: 0.1 },
      { symbol: 'XLU', name: 'Utilities', change: 0.6 },
      { symbol: 'XLB', name: 'Materials', change: -0.8 },
      { symbol: 'XLRE', name: 'Real Estate', change: -0.3 }
    ]
  };
}

export async function getSectorSummary(
  _ctx: ServerContext,
  _req: GetSectorSummaryRequest,
): Promise<GetSectorSummaryResponse> {
  try {
    const result = await getCachedJson(SEED_CACHE_KEY, true) as GetSectorSummaryResponse | null;
    if (result && result.sectors && result.sectors.length > 0) {
      return result;
    }
    // Local dev fallback
    return getMockSectors();
  } catch {
    return getMockSectors();
  }
}
