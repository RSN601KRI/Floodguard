/**
 * Simulated Data Sources — mimics real-time sensor feeds, weather APIs,
 * satellite imagery, census, and social media signals.
 */

import type { WeatherEvent, SocialSignal, SatelliteIndicator, RiverEntity } from './ontology';

// ─── HELPERS ────────────────────────────────────────────────────

const jitter = (base: number, range: number) => base + (Math.random() - 0.5) * 2 * range;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
let idCounter = 0;
const uid = (prefix: string) => `${prefix}-${++idCounter}-${Date.now().toString(36)}`;

// ─── CRISIS MULTIPLIER ─────────────────────────────────────────

let crisisMode = false;
export function setCrisisMode(active: boolean) { crisisMode = active; }
export function getCrisisMode() { return crisisMode; }

// ─── WEATHER API SIMULATION ────────────────────────────────────

const weatherProfiles: Record<string, { baseIntensity: number; volatility: number }> = {
  'w-upstream-ganga': { baseIntensity: 35, volatility: 25 },
  'w-upstream-kosi': { baseIntensity: 55, volatility: 35 },
  'w-upstream-gandak': { baseIntensity: 30, volatility: 20 },
  'w-local': { baseIntensity: 45, volatility: 30 },
};

export function generateWeatherEvents(): WeatherEvent[] {
  const crisisBoost = crisisMode ? 1.8 : 1;
  return Object.entries(weatherProfiles).map(([id, profile]) => {
    const intensity = clamp(jitter(profile.baseIntensity * crisisBoost, profile.volatility), 0, 150);
    return {
      id,
      type: intensity > 100 ? 'cloudburst' : intensity > 60 ? 'storm' : 'rainfall',
      intensity: Math.round(intensity * 10) / 10,
      duration: Math.round(jitter(6, 4)),
      cumulativeRainfall: Math.round(intensity * jitter(4, 2)),
      forecastConfidence: clamp(jitter(0.82, 0.12), 0.5, 0.99),
      timestamp: Date.now(),
    };
  });
}

// ─── RIVER SENSOR SIMULATION ───────────────────────────────────

export function updateRiverSensor(
  river: RiverEntity,
  upstreamRainfall: number
): RiverEntity {
  const crisisBoost = crisisMode ? 1.6 : 1;
  const rainfallEffect = (upstreamRainfall / 100) * 0.3 * crisisBoost;
  const naturalDrift = (Math.random() - (crisisMode ? 0.3 : 0.48)) * 0.15;
  const newLevel = clamp(
    river.currentLevel + rainfallEffect + naturalDrift,
    1.0,
    river.dangerLevel + 2.0
  );
  const newFlow = clamp(river.flowRate + (newLevel - river.currentLevel) * 2000, 1000, 50000);

  const trend: RiverEntity['trend'] =
    newLevel > river.currentLevel + 0.05 ? 'rising'
      : newLevel < river.currentLevel - 0.05 ? 'falling'
        : 'stable';

  return {
    ...river,
    currentLevel: Math.round(newLevel * 100) / 100,
    flowRate: Math.round(newFlow),
    trend,
    lastUpdated: Date.now(),
  };
}

// ─── SATELLITE INDICATORS ──────────────────────────────────────

export function generateSatelliteData(zoneId: string, riskScore: number): SatelliteIndicator {
  const baseExtent = riskScore > 70 ? jitter(45, 15) : riskScore > 40 ? jitter(20, 10) : jitter(5, 3);
  return {
    zoneId,
    waterExtentKm2: Math.round(clamp(baseExtent, 0, 120) * 10) / 10,
    changePercent: Math.round(jitter(riskScore > 50 ? 15 : -2, 10) * 10) / 10,
    cloudCover: clamp(jitter(0.4, 0.3), 0, 1),
    captureTime: Date.now() - Math.round(Math.random() * 3600000),
    resolution: '10m',
  };
}

// ─── SOCIAL MEDIA SIGNALS ──────────────────────────────────────

const socialTemplates = [
  { keyword: 'flood', source: 'twitter' as const, sentiment: 'alarm' as const, content: 'Water level rising rapidly near {zone}, roads submerged!' },
  { keyword: 'water rising', source: 'whatsapp' as const, sentiment: 'alarm' as const, content: 'Urgent: Water entering houses in {zone} area. Need help!' },
  { keyword: 'relief camp', source: 'twitter' as const, sentiment: 'neutral' as const, content: 'Relief camp set up at {zone} school. Food and medical aid available.' },
  { keyword: 'rescue', source: 'news' as const, sentiment: 'alarm' as const, content: 'NDRF teams conducting rescue operations in {zone} district.' },
  { keyword: 'water receding', source: 'twitter' as const, sentiment: 'relief' as const, content: 'Good news — water receding in parts of {zone}. Situation improving.' },
  { keyword: 'embankment breach', source: 'news' as const, sentiment: 'alarm' as const, content: 'BREAKING: Embankment breach reported near {zone}. Emergency alert issued.' },
  { keyword: 'evacuation', source: 'whatsapp' as const, sentiment: 'alarm' as const, content: 'Evacuation order issued for low-lying areas of {zone}. Move to high ground.' },
];

export function generateSocialSignals(zoneNames: string[], count = 2): SocialSignal[] {
  const effectiveCount = crisisMode ? count + 2 : count;
  const signals: SocialSignal[] = [];
  for (let i = 0; i < effectiveCount; i++) {
    const template = crisisMode
      ? socialTemplates.filter((t) => t.sentiment === 'alarm')[Math.floor(Math.random() * 4)]
      : socialTemplates[Math.floor(Math.random() * socialTemplates.length)];
    const zone = zoneNames[Math.floor(Math.random() * zoneNames.length)];
    signals.push({
      id: uid('social'),
      keyword: template.keyword,
      source: template.source,
      sentiment: template.sentiment,
      location: zone,
      timestamp: Date.now(),
      content: template.content.replace('{zone}', zone),
    });
  }
  return signals;
}
