/**
 * Shared ACLED API fetch with Redis caching.
 *
 * Three endpoints call ACLED independently (risk-scores, unrest-events,
 * acled-events) with overlapping queries. This shared layer ensures
 * identical queries hit Redis instead of making redundant upstream calls.
 */
import { CHROME_UA } from './constants';
import { cachedFetchJson } from './redis';
import { getAcledAccessToken } from './acled-auth';

const ACLED_API_URL = 'https://acleddata.com/api/acled/read';
const ACLED_CACHE_TTL = 900; // 15 min — matches ACLED rate-limit window
const ACLED_TIMEOUT_MS = 15_000;

export interface AcledRawEvent {
  event_id_cnty?: string;
  event_type?: string;
  sub_event_type?: string;
  country?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  event_date?: string;
  fatalities?: string;
  source?: string;
  actor1?: string;
  actor2?: string;
  admin1?: string;
  notes?: string;
  tags?: string;
}

interface FetchAcledOptions {
  eventTypes: string;
  startDate: string;
  endDate: string;
  country?: string;
  limit?: number;
}

function getMockAcledEvents(startDate: string, endDate: string): AcledRawEvent[] {
  const countries = ['United States', 'Russia', 'China', 'Ukraine', 'United Kingdom', 'India', 'Israel', 'Taiwan', 'South Korea'];
  const eventTypes = ['Protests', 'Riots', 'Battles', 'Explosions/Remote violence', 'Violence against civilians'];
  const events: AcledRawEvent[] = [];
  
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();
  const duration = endMs - startMs;
  
  const count = 75;
  for (let i = 0; i < count; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)]!;
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]!;
    const fatalities = Math.random() > 0.85 ? String(Math.floor(Math.random() * 5) + 1) : '0';
    const dateMs = startMs + Math.random() * duration;
    const eventDate = new Date(dateMs).toISOString().split('T')[0];
    
    events.push({
      event_id_cnty: `mock-acled-${i}-${dateMs}`,
      event_type: eventType,
      country: country,
      event_date: eventDate,
      fatalities: fatalities,
      location: 'Centroid Location',
      latitude: '0',
      longitude: '0',
      source: 'Mock Source',
    });
  }
  return events;
}

/**
 * Fetch ACLED events with automatic Redis caching.
 * Cache key is derived from query parameters so identical queries across
 * different handlers share the same cached result.
 */
export async function fetchAcledCached(opts: FetchAcledOptions): Promise<AcledRawEvent[]> {
  const token = await getAcledAccessToken();
  if (!token) {
    if (process.env.LOCAL_API_MODE === 'true') {
      return getMockAcledEvents(opts.startDate, opts.endDate);
    }
    return [];
  }

  const cacheKey = `acled:shared:${opts.eventTypes}:${opts.startDate}:${opts.endDate}:${opts.country || 'all'}:${opts.limit || 500}`;
  const result = await cachedFetchJson<AcledRawEvent[]>(cacheKey, ACLED_CACHE_TTL, async () => {
    const params = new URLSearchParams({
      event_type: opts.eventTypes,
      event_date: `${opts.startDate}|${opts.endDate}`,
      event_date_where: 'BETWEEN',
      limit: String(opts.limit || 500),
      _format: 'json',
    });
    if (opts.country) params.set('country', opts.country);

    const resp = await fetch(`${ACLED_API_URL}?${params}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': CHROME_UA,
      },
      signal: AbortSignal.timeout(ACLED_TIMEOUT_MS),
    });

    if (!resp.ok) throw new Error(`ACLED API error: ${resp.status}`);
    const data = (await resp.json()) as { data?: AcledRawEvent[]; message?: string; error?: string };
    if (data.message || data.error) throw new Error(data.message || data.error || 'ACLED API error');

    const events = data.data || [];
    return events.length > 0 ? events : null;
  });
  return result || [];
}
