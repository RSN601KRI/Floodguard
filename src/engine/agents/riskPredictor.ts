/**
 * AI Agent 1: Risk Predictor
 * Predicts flood likelihood per zone using ontology data.
 */

import type { OntologyState, ZoneEntity, RiskLevel } from '../ontology';
import { calculateRiskScore } from '../riskScoring';

export interface ZoneRiskPrediction {
  zoneId: string;
  zoneName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  predictedFloodTime: string;
  confidence: number;
  breakdown: {
    riverComponent: number;
    rainfallComponent: number;
    satelliteComponent: number;
    socialComponent: number;
    historicalComponent: number;
  };
  trend: 'worsening' | 'stable' | 'improving';
}

// Track previous scores for trend detection
const previousScores = new Map<string, number[]>();

const HISTORICAL_BASE_RISK: Record<string, number> = {
  'zone-a': 0.6,  // Patna — historically flood-prone
  'zone-b': 0.55, // Muzaffarpur — Gandak floods
  'zone-c': 0.5,  // Darbhanga — Bagmati/Kosi
  'zone-d': 0.3,  // Bhagalpur — moderate
  'zone-e': 0.75, // Saharsa — Kosi, very high historical
  'zone-f': 0.2,  // Begusarai — lower risk
  'zone-g': 0.15, // Munger — lower risk
};

export function runRiskPredictor(state: OntologyState): ZoneRiskPrediction[] {
  const predictions: ZoneRiskPrediction[] = [];

  for (const [zoneId, zone] of state.zones) {
    // Find rivers affecting this zone
    const affectingRivers = state.relationships.riverAffectsZone
      .filter((r) => r.zoneId === zoneId)
      .map((rel) => ({
        river: state.rivers.get(rel.riverId)!,
        impactWeight: rel.impactWeight,
      }))
      .filter((r) => r.river);

    // Find weather events impacting those rivers
    const relevantRiverIds = new Set(affectingRivers.map((r) => r.river.id));
    const weatherEventIds = state.relationships.weatherImpactsRiver
      .filter((r) => relevantRiverIds.has(r.riverId))
      .map((r) => r.weatherEventId);
    const weather = weatherEventIds
      .map((id) => state.weather.get(id))
      .filter(Boolean) as any[];

    // Satellite data
    const satellite = state.satellites.get(zoneId) || null;

    // Social alarm signals for this zone
    const socialAlarmCount = state.socialSignals
      .filter((s) => s.sentiment === 'alarm' && s.location === zone.name)
      .length;

    const result = calculateRiskScore({
      rivers: affectingRivers,
      weather,
      satellite,
      socialAlarmCount,
      historicalBaseRisk: HISTORICAL_BASE_RISK[zoneId] || 0.3,
    });

    // Track trend
    const history = previousScores.get(zoneId) || [];
    history.push(result.score);
    if (history.length > 5) history.shift();
    previousScores.set(zoneId, history);

    let trend: ZoneRiskPrediction['trend'] = 'stable';
    if (history.length >= 3) {
      const recent = history.slice(-3);
      const avgChange = (recent[2] - recent[0]) / 2;
      trend = avgChange > 3 ? 'worsening' : avgChange < -3 ? 'improving' : 'stable';
    }

    predictions.push({
      zoneId,
      zoneName: zone.name,
      riskScore: result.score,
      riskLevel: result.level,
      predictedFloodTime: result.predictedFloodTime,
      confidence: result.confidence,
      breakdown: result.breakdown,
      trend,
    });
  }

  return predictions.sort((a, b) => b.riskScore - a.riskScore);
}
