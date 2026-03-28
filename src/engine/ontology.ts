/**
 * Bihar FloodGuard — Ontology Model
 * Inspired by Palantir Foundry's object-centric data model.
 * Defines all entities and their typed relationships.
 */

// ─── ENTITY TYPES ───────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ZoneEntity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  district: string;
  areaKm2: number;
  // Computed / dynamic
  riskScore: number;
  riskLevel: RiskLevel;
  predictedFloodTime: string;
  lastUpdated: number; // epoch ms
}

export interface RiverEntity {
  id: string;
  name: string;
  currentLevel: number;     // meters
  dangerLevel: number;      // meters
  warningLevel: number;     // meters
  flowRate: number;         // cumecs
  trend: 'rising' | 'stable' | 'falling';
  lastUpdated: number;
}

export interface WeatherEvent {
  id: string;
  type: 'rainfall' | 'storm' | 'cyclone' | 'cloudburst';
  intensity: number;        // mm/hr
  duration: number;         // hours predicted
  cumulativeRainfall: number; // mm
  forecastConfidence: number; // 0-1
  timestamp: number;
}

export interface PopulationEntity {
  zoneId: string;
  total: number;
  vulnerable: number;       // elderly + children
  belowPovertyLine: number;
  evacuated: number;
  inShelters: number;
}

export interface AlertEntity {
  id: string;
  zoneId: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  source: 'sensor' | 'ai-agent' | 'manual' | 'social-media';
  timestamp: number;
  acknowledged: boolean;
}

export interface SocialSignal {
  id: string;
  keyword: string;
  source: 'twitter' | 'whatsapp' | 'news';
  sentiment: 'alarm' | 'neutral' | 'relief';
  location: string;
  timestamp: number;
  content: string;
}

export interface SatelliteIndicator {
  zoneId: string;
  waterExtentKm2: number;
  changePercent: number;   // + means expansion
  cloudCover: number;      // 0-1
  captureTime: number;
  resolution: string;
}

// ─── RELATIONSHIPS ──────────────────────────────────────────────

export interface OntologyRelationships {
  riverAffectsZone: Array<{ riverId: string; zoneId: string; impactWeight: number }>;
  weatherImpactsRiver: Array<{ weatherEventId: string; riverId: string; lagHours: number }>;
  zoneContainsPopulation: Array<{ zoneId: string; populationId: string }>;
  alertLinkedToZone: Array<{ alertId: string; zoneId: string }>;
}

// ─── FULL ONTOLOGY STATE ────────────────────────────────────────

export interface OntologyState {
  zones: Map<string, ZoneEntity>;
  rivers: Map<string, RiverEntity>;
  weather: Map<string, WeatherEvent>;
  population: Map<string, PopulationEntity>;
  alerts: AlertEntity[];
  socialSignals: SocialSignal[];
  satellites: Map<string, SatelliteIndicator>;
  relationships: OntologyRelationships;
  lastPipelineRun: number;
}

// ─── INITIAL SEED ───────────────────────────────────────────────

export function createInitialOntology(): OntologyState {
  const zones = new Map<string, ZoneEntity>([
    ['zone-a', { id: 'zone-a', name: 'Patna North', lat: 25.62, lng: 85.13, district: 'Patna', areaKm2: 180, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-b', { id: 'zone-b', name: 'Muzaffarpur', lat: 26.12, lng: 85.39, district: 'Muzaffarpur', areaKm2: 220, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-c', { id: 'zone-c', name: 'Darbhanga', lat: 26.15, lng: 85.90, district: 'Darbhanga', areaKm2: 195, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-d', { id: 'zone-d', name: 'Bhagalpur', lat: 25.24, lng: 86.97, district: 'Bhagalpur', areaKm2: 250, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-e', { id: 'zone-e', name: 'Saharsa', lat: 25.88, lng: 86.60, district: 'Saharsa', areaKm2: 160, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-f', { id: 'zone-f', name: 'Begusarai', lat: 25.42, lng: 86.13, district: 'Begusarai', areaKm2: 210, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
    ['zone-g', { id: 'zone-g', name: 'Munger', lat: 25.37, lng: 86.47, district: 'Munger', areaKm2: 175, riskScore: 0, riskLevel: 'low', predictedFloodTime: 'N/A', lastUpdated: Date.now() }],
  ]);

  const rivers = new Map<string, RiverEntity>([
    ['ganga', { id: 'ganga', name: 'Ganga', currentLevel: 4.5, dangerLevel: 8.0, warningLevel: 6.5, flowRate: 12000, trend: 'stable', lastUpdated: Date.now() }],
    ['kosi', { id: 'kosi', name: 'Kosi', currentLevel: 5.2, dangerLevel: 7.5, warningLevel: 6.0, flowRate: 8500, trend: 'rising', lastUpdated: Date.now() }],
    ['gandak', { id: 'gandak', name: 'Gandak', currentLevel: 3.8, dangerLevel: 7.0, warningLevel: 5.5, flowRate: 6200, trend: 'stable', lastUpdated: Date.now() }],
    ['bagmati', { id: 'bagmati', name: 'Bagmati', currentLevel: 4.1, dangerLevel: 6.5, warningLevel: 5.0, flowRate: 3800, trend: 'rising', lastUpdated: Date.now() }],
  ]);

  const population = new Map<string, PopulationEntity>([
    ['zone-a', { zoneId: 'zone-a', total: 245000, vulnerable: 52000, belowPovertyLine: 38000, evacuated: 0, inShelters: 0 }],
    ['zone-b', { zoneId: 'zone-b', total: 393000, vulnerable: 78000, belowPovertyLine: 61000, evacuated: 0, inShelters: 0 }],
    ['zone-c', { zoneId: 'zone-c', total: 296000, vulnerable: 55000, belowPovertyLine: 44000, evacuated: 0, inShelters: 0 }],
    ['zone-d', { zoneId: 'zone-d', total: 410000, vulnerable: 82000, belowPovertyLine: 58000, evacuated: 0, inShelters: 0 }],
    ['zone-e', { zoneId: 'zone-e', total: 150000, vulnerable: 35000, belowPovertyLine: 28000, evacuated: 0, inShelters: 0 }],
    ['zone-f', { zoneId: 'zone-f', total: 250000, vulnerable: 48000, belowPovertyLine: 35000, evacuated: 0, inShelters: 0 }],
    ['zone-g', { zoneId: 'zone-g', total: 190000, vulnerable: 38000, belowPovertyLine: 27000, evacuated: 0, inShelters: 0 }],
  ]);

  const relationships: OntologyRelationships = {
    riverAffectsZone: [
      { riverId: 'ganga', zoneId: 'zone-a', impactWeight: 0.9 },
      { riverId: 'ganga', zoneId: 'zone-d', impactWeight: 0.7 },
      { riverId: 'ganga', zoneId: 'zone-f', impactWeight: 0.5 },
      { riverId: 'ganga', zoneId: 'zone-g', impactWeight: 0.4 },
      { riverId: 'kosi', zoneId: 'zone-e', impactWeight: 0.95 },
      { riverId: 'kosi', zoneId: 'zone-c', impactWeight: 0.6 },
      { riverId: 'gandak', zoneId: 'zone-b', impactWeight: 0.85 },
      { riverId: 'bagmati', zoneId: 'zone-c', impactWeight: 0.7 },
      { riverId: 'bagmati', zoneId: 'zone-a', impactWeight: 0.3 },
    ],
    weatherImpactsRiver: [
      { weatherEventId: 'w-upstream-ganga', riverId: 'ganga', lagHours: 12 },
      { weatherEventId: 'w-upstream-kosi', riverId: 'kosi', lagHours: 6 },
      { weatherEventId: 'w-upstream-gandak', riverId: 'gandak', lagHours: 8 },
      { weatherEventId: 'w-local', riverId: 'bagmati', lagHours: 2 },
    ],
    zoneContainsPopulation: zones.size > 0
      ? Array.from(zones.keys()).map((zId) => ({ zoneId: zId, populationId: zId }))
      : [],
    alertLinkedToZone: [],
  };

  return {
    zones,
    rivers,
    weather: new Map(),
    population,
    alerts: [],
    socialSignals: [],
    satellites: new Map(),
    relationships,
    lastPipelineRun: Date.now(),
  };
}
