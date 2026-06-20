// Base configuration shared across all variants
import type { PanelConfig, MapLayers } from '@/types';

// Shared exports (re-exported by all variants)
export { SECTORS, COMMODITIES, MARKET_SYMBOLS } from '../markets';
export { UNDERSEA_CABLES } from '../geo';
export { AI_DATA_CENTERS } from '../ai-datacenters';

// Idle pause duration - shared across map and stream panels (5 minutes)
export const IDLE_PAUSE_MS = 5 * 60 * 1000;

// Refresh intervals (ms) — CYBERSPACE edition (faster polling)
export const REFRESH_INTERVALS = {
  feeds: 5 * 60 * 1000,           // 5 min (was 20)
  markets: 3 * 60 * 1000,         // 3 min (was 12)
  crypto: 3 * 60 * 1000,          // 3 min (was 12)
  predictions: 5 * 60 * 1000,     // 5 min (was 15)
  forecasts: 10 * 60 * 1000,      // 10 min (was 30)
  ais: 5 * 60 * 1000,             // 5 min (was 15)
  pizzint: 5 * 60 * 1000,         // 5 min (was 10)
  natural: 30 * 60 * 1000,        // 30 min (was 60)
  weather: 5 * 60 * 1000,         // 5 min (was 10)
  fred: 2 * 60 * 60 * 1000,       // 2 h (was 6)
  oil: 2 * 60 * 60 * 1000,        // 2 h (was 6)
  spending: 2 * 60 * 60 * 1000,   // 2 h (was 6)
  bis: 2 * 60 * 60 * 1000,        // 2 h (was 6)
  firms: 10 * 60 * 1000,          // 10 min (was 30)
  cables: 10 * 60 * 1000,         // 10 min (was 30)
  cableHealth: 60 * 60 * 1000,    // 1 h (was 2)
  flights: 30 * 60 * 1000,        // 30 min (was 2h)
  cyberThreats: 5 * 60 * 1000,    // 5 min (was 10)
  stockAnalysis: 5 * 60 * 1000,   // 5 min (was 15)
  dailyMarketBrief: 30 * 60 * 1000,        // 30 min (was 60)
  marketImplications: 60 * 60 * 1000,      // 1 h (was 3)
  stockBacktest: 2 * 60 * 60 * 1000,       // 2 h (was 4)
  serviceStatus: 60 * 1000,       // 1 min (was 3)
  stablecoins: 5 * 60 * 1000,     // 5 min (was 15)
  etfFlows: 5 * 60 * 1000,        // 5 min (was 15)
  macroSignals: 5 * 60 * 1000,    // 5 min (was 15)
  fearGreed: 10 * 60 * 1000,      // 10 min (was 30)
  strategicPosture: 5 * 60 * 1000,// 5 min (was 15)
  strategicRisk: 2 * 60 * 1000,   // 2 min (was 5)
  healthFreshness: 30 * 1000,     // 30 s (was 60)
  temporalBaseline: 5 * 60 * 1000,// 5 min (was 10)
  tradePolicy: 30 * 60 * 1000,    // 30 min (was 60)
  supplyChain: 30 * 60 * 1000,    // 30 min (was 60)
  telegramIntel: 30 * 1000,       // 30 s (was 60)
  gulfEconomies: 5 * 60 * 1000,   // 5 min (was 10)
  groceryBasket: 2 * 60 * 60 * 1000, // 2 h (was 6)
  fuelPrices: 2 * 60 * 60 * 1000,    // 2 h (was 6)
  faoFoodPriceIndex: 12 * 60 * 60 * 1000, // 12 h (was 24)
  oilInventories: 2 * 60 * 1000,   // 2 min (was 5)
  climateNews: 10 * 60 * 1000,     // 10 min (was 30)
  intelligence: 5 * 60 * 1000,     // 5 min (was 15)
  correlationEngine: 2 * 60 * 1000,// 2 min (was 5)
  defensePatents: 6 * 60 * 60 * 1000, // 6 h (was 24)
  wsbTickers: 3 * 60 * 1000,       // 3 min (was 10)
  crossSourceSignals: 5 * 60 * 1000,// 5 min (was 15)
  hormuzTracker: 30 * 60 * 1000,   // 30 min (was 60)
  hyperliquidFlow: 2 * 60 * 1000,  // 2 min (was 5)
  energyCrisis: 2 * 60 * 60 * 1000,// 2 h (was 6)
  pipelineStatus: 6 * 60 * 60 * 1000, // 6 h (was 24)
  storageFacilityMap: 6 * 60 * 60 * 1000, // 6 h (was 24)
  fuelShortages: 20 * 60 * 1000,   // 20 min (was 60)
  energyDisruptions: 20 * 60 * 1000, // 20 min (was 60)
  energyRiskOverview: 5 * 60 * 1000, // 5 min (was 15)
  chokepointStrip: 30 * 60 * 1000, // 30 min (was 90)
  macroTiles: 10 * 60 * 1000,      // 10 min (was 30)
  fsi: 10 * 60 * 1000,             // 10 min (was 30)
  yieldCurve: 10 * 60 * 1000,      // 10 min (was 30)
  earningsCalendar: 30 * 60 * 1000,// 30 min (was 60)
  economicCalendar: 30 * 60 * 1000,// 30 min (was 60)
  cotPositioning: 30 * 60 * 1000,  // 30 min (was 60)
  goldIntelligence: 2 * 60 * 1000, // 2 min (was 5)
  aaiiSentiment: 30 * 60 * 1000,   // 30 min (was 60)
  marketBreadth: 20 * 60 * 1000,   // 20 min (was 60)
};

// Monitor colors - shared
export const MONITOR_COLORS = [
  '#44ff88',
  '#ff8844',
  '#4488ff',
  '#ff44ff',
  '#ffff44',
  '#ff4444',
  '#44ffff',
  '#88ff44',
  '#ff88ff',
  '#88ffff',
];

// Storage keys - shared
export const STORAGE_KEYS = {
  panels: 'cyberspace-panels',
  monitors: 'cyberspace-monitors',
  mapLayers: 'cyberspace-layers',
  disabledFeeds: 'cyberspace-disabled-feeds',
  // Schema version for the disabledFeeds set. Bumped on each migration that
  // mutates the set in a backwards-incompatible way. Currently:
  //   missing/0 → pre-2026-05-01 alphabetical-cap state. Eligible for
  //               one-time recovery of fully-disabled categories.
  //   1 → recovery has run; the set is post-migration and must NOT be
  //       re-recovered on subsequent loads (otherwise user-explicit
  //       full-category disabling would be silently undone forever).
  disabledFeedsSchema: 'cyberspace-disabled-feeds-schema',
  liveChannels: 'cyberspace-live-channels',
  mapMode: 'cyberspace-map-mode',          // 'flat' | 'globe'
  activeChannel: 'cyberspace-active-channel',
  webcamPrefs: 'cyberspace-webcam-prefs',
} as const;

export type MapModePreference = 'flat' | 'globe';
export const DEFAULT_MAP_MODE: MapModePreference = 'flat';

// Type definitions for variant configs
export interface VariantConfig {
  name: string;
  description: string;
  panels: Record<string, PanelConfig>;
  mapLayers: MapLayers;
  mobileMapLayers: MapLayers;
}
