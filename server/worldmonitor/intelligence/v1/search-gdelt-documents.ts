import type {
  ServerContext,
  SearchGdeltDocumentsRequest,
  SearchGdeltDocumentsResponse,
} from '../../../../src/generated/server/cyberspace/intelligence/v1/service_server';

import { getCachedJson, setCachedJson } from '../../../_shared/redis';

const SEEDED_KEY = 'intelligence:gdelt-intel:v1';
const GDELT_API_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';
const GDELT_TIMEOUT_MS = 12_000;

// All GDELT fetching happens in the Railway seed script
// (scripts/seed-gdelt-intel.mjs). This handler reads pre-seeded
// topic data from Redis only (gold standard: Vercel reads, Railway writes).
// In local dev mode (LOCAL_API_MODE=true) where no seed data exists,
// we fall back to fetching GDELT directly.

type SeededGdeltData = {
  topics?: Array<{
    id: string;
    articles: Array<{
      title: string;
      url: string;
      source: string;
      date: string;
      image: string;
      language: string;
      tone: number;
    }>;
  }>;
};

type GdeltApiArticle = {
  title?: string;
  url?: string;
  seendate?: string;
  domain?: string;
  socialimage?: string;
  language?: string;
  tone?: number;
};

/**
 * Direct GDELT API fallback for local dev mode.
 * Fetches articles from the public GDELT DOC 2.0 API.
 */
async function fetchGdeltDirectly(
  query: string,
  maxRecords: number,
  timespan: string,
): Promise<SearchGdeltDocumentsResponse> {
  const params = new URLSearchParams({
    query,
    mode: 'ArtList',
    maxrecords: String(maxRecords),
    timespan: timespan || '24h',
    format: 'json',
    sort: 'DateDesc',
  });

  const resp = await fetch(`${GDELT_API_BASE}?${params}`, {
    signal: AbortSignal.timeout(GDELT_TIMEOUT_MS),
  });

  if (!resp.ok) {
    return { articles: [], query, error: '' };
  }

  const data = await resp.json() as { articles?: GdeltApiArticle[] };
  const articles = (data.articles || []).slice(0, maxRecords).map((a) => ({
    title: a.title || '',
    url: a.url || '',
    source: a.domain || '',
    date: a.seendate || '',
    image: a.socialimage || '',
    language: a.language || '',
    tone: a.tone || 0,
  }));

  return { articles, query, error: '' };
}

export async function searchGdeltDocuments(
  _ctx: ServerContext,
  req: SearchGdeltDocumentsRequest,
): Promise<SearchGdeltDocumentsResponse> {
  if (!req.query || req.query.length < 2) {
    return { articles: [], query: req.query || '', error: 'Query parameter required' };
  }

  try {
    const seeded = await getCachedJson(SEEDED_KEY, true) as SeededGdeltData | null;
    if (!seeded?.topics?.length) {
      // No seed data — fall back to direct GDELT API fetch in local dev mode.
      try {
        const maxRecords = Math.min(req.maxRecords > 0 ? req.maxRecords : 10, 20);
        const result = await fetchGdeltDirectly(req.query, maxRecords, req.timespan || '24h');
        // Cache the result in the sidecar so subsequent requests are fast.
        if (result.articles.length > 0) {
          const topicId = req.query.toLowerCase().split(/\s+/)[0] || 'generic';
          const existing = await getCachedJson(SEEDED_KEY, true) as SeededGdeltData | null;
          const topics = existing?.topics || [];
          const existingIdx = topics.findIndex(t => t.id === topicId);
          if (existingIdx >= 0) {
            topics[existingIdx] = { id: topicId, articles: result.articles };
          } else {
            topics.push({ id: topicId, articles: result.articles });
          }
          void setCachedJson(SEEDED_KEY, { topics }, 600, true);
        }
        return result;
      } catch (e) {
        console.warn('[search-gdelt-documents] Direct GDELT fallback failed:', e);
        return { articles: [], query: req.query, error: 'seed-unavailable' };
      }
    }

    const queryLower = req.query.toLowerCase();
    const match = seeded.topics.find(t =>
      queryLower.includes(t.id) || t.articles.some(a => a.title.toLowerCase().includes(queryLower.slice(0, 20)))
    );

    if (!match) {
      return { articles: [], query: req.query, error: '' };
    }

    const maxRecords = Math.min(req.maxRecords > 0 ? req.maxRecords : 10, 20);
    return {
      articles: match.articles.slice(0, maxRecords),
      query: req.query,
      error: '',
    };
  } catch {
    return { articles: [], query: req.query, error: '' };
  }
}
