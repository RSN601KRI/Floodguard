/**
 * Risk Scoring Model — combines multiple signals into a 0-100 risk score.
 * Weights calibrated to Bihar flood patterns.
 */

import type { RiverEntity, WeatherEvent, SatelliteIndicator, SocialSignal, RiskLevel } from './ontology';

interface RiskInput {
  rivers: { river: RiverEntity; impactWeight: number }[];
  weather: WeatherEvent[];
  satellite: SatelliteIndicator | null;
  socialAlarmCount: number;
  historicalBaseRisk: number; // 0-1 base risk from history
}

interface RiskOutput {
  score: number;           // 0-100
  level: RiskLevel;
  breakdown: {
    riverComponent: number;
    rainfallComponent: number;
    satelliteComponent: number;
    socialComponent: number;
    historicalComponent: number;
  };
  predictedFloodTime: string;
  confidence: number;      // 0-1
}

// ─── WEIGHTS ────────────────────────────────────────────────────

const WEIGHTS = {
  river: 0.35,
  rainfall: 0.25,
  satellite: 0.15,
  social: 0.10,
  historical: 0.15,
} as const;

// ─── SCORING FUNCTIONS ─────────────────────────────────────────

function scoreRiverThreat(rivers: RiskInput['rivers']): number {
  if (rivers.length === 0) return 0;
  let maxThreat = 0;
  for (const { river, impactWeight } of rivers) {
    const levelRatio = river.currentLevel / river.dangerLevel;
    // Exponential scaling: risk increases sharply as level approaches danger
    const threat = Math.min(1, Math.pow(levelRatio, 2.5)) * 100;
    const trendBonus = river.trend === 'rising' ? 10 : river.trend === 'falling' ? -5 : 0;
    maxThreat = Math.max(maxThreat, (threat + trendBonus) * impactWeight);
  }
  return Math.min(100, maxThreat);
}

function scoreRainfall(weather: WeatherEvent[]): number {
  if (weather.length === 0) return 0;
  const maxIntensity = Math.max(...weather.map((w) => w.intensity));
  const maxCumulative = Math.max(...weather.map((w) => w.cumulativeRainfall));
  // Intensity > 80mm/hr is extreme, > 40 heavy
  const intensityScore = Math.min(100, (maxIntensity / 100) * 100);
  // Cumulative > 200mm is dangerous
  const cumulativeScore = Math.min(100, (maxCumulative / 250) * 100);
  return intensityScore * 0.6 + cumulativeScore * 0.4;
}

function scoreSatellite(sat: SatelliteIndicator | null): number {
  if (!sat) return 0;
  // Water extent > 50km2 is serious, change > 20% is alarming
  const extentScore = Math.min(100, (sat.waterExtentKm2 / 60) * 100);
  const changeScore = Math.min(100, Math.max(0, sat.changePercent) * 4);
  return extentScore * 0.5 + changeScore * 0.5;
}

function scoreSocial(alarmCount: number): number {
  // 5+ alarm signals = very concerning
  return Math.min(100, alarmCount * 20);
}

// ─── MAIN SCORING ───────────────────────────────────────────────

export function calculateRiskScore(input: RiskInput): RiskOutput {
  const riverComponent = scoreRiverThreat(input.rivers);
  const rainfallComponent = scoreRainfall(input.weather);
  const satelliteComponent = scoreSatellite(input.satellite);
  const socialComponent = scoreSocial(input.socialAlarmCount);
  const historicalComponent = input.historicalBaseRisk * 100;

  const rawScore =
    riverComponent * WEIGHTS.river +
    rainfallComponent * WEIGHTS.rainfall +
    satelliteComponent * WEIGHTS.satellite +
    socialComponent * WEIGHTS.social +
    historicalComponent * WEIGHTS.historical;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  const level: RiskLevel = score >= 65 ? 'high' : score >= 35 ? 'medium' : 'low';

  // Predict flood time based on score and river trends
  const predictedFloodTime =
    score >= 85 ? '1-2 hours'
      : score >= 70 ? '2-4 hours'
        : score >= 55 ? '6-12 hours'
          : score >= 40 ? '12-24 hours'
            : 'No immediate threat';

  // Confidence based on data quality
  const avgConfidence = input.weather.length > 0
    ? input.weather.reduce((s, w) => s + w.forecastConfidence, 0) / input.weather.length
    : 0.5;
  const dataCompleteness = [
    input.rivers.length > 0,
    input.weather.length > 0,
    input.satellite !== null,
  ].filter(Boolean).length / 3;
  const confidence = Math.round((avgConfidence * 0.6 + dataCompleteness * 0.4) * 100) / 100;

  return {
    score,
    level,
    breakdown: {
      riverComponent: Math.round(riverComponent),
      rainfallComponent: Math.round(rainfallComponent),
      satelliteComponent: Math.round(satelliteComponent),
      socialComponent: Math.round(socialComponent),
      historicalComponent: Math.round(historicalComponent),
    },
    predictedFloodTime,
    confidence,
  };
}
