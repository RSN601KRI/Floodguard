/**
 * Data Pipeline — ingests simulated data, normalizes it,
 * runs through the ontology, and updates state.
 */

import type { OntologyState, AlertEntity } from './ontology';
import {
  generateWeatherEvents,
  updateRiverSensor,
  generateSatelliteData,
  generateSocialSignals,
} from './dataSources';
import { runRiskPredictor, type ZoneRiskPrediction } from './agents/riskPredictor';
import { runEvacuationPlanner, type EvacuationSummary } from './agents/evacuationPlanner';
import { runResourceAllocator, type ResourceAllocationResult } from './agents/resourceAllocator';

export interface PipelineOutput {
  state: OntologyState;
  predictions: ZoneRiskPrediction[];
  evacuation: EvacuationSummary;
  resources: ResourceAllocationResult;
  newAlerts: AlertEntity[];
}

let alertCounter = 0;

function generateAlerts(
  predictions: ZoneRiskPrediction[],
  state: OntologyState
): AlertEntity[] {
  const newAlerts: AlertEntity[] = [];

  for (const pred of predictions) {
    // Generate alerts for significant changes
    const zone = state.zones.get(pred.zoneId);
    if (!zone) continue;

    if (pred.riskScore >= 80 && zone.riskScore < 80) {
      newAlerts.push({
        id: `alert-${++alertCounter}`,
        zoneId: pred.zoneId,
        type: 'critical',
        message: `CRITICAL: ${pred.zoneName} risk score surged to ${pred.riskScore}% — flood expected in ${pred.predictedFloodTime}`,
        source: 'ai-agent',
        timestamp: Date.now(),
        acknowledged: false,
      });
    } else if (pred.riskScore >= 60 && zone.riskScore < 60) {
      newAlerts.push({
        id: `alert-${++alertCounter}`,
        zoneId: pred.zoneId,
        type: 'warning',
        message: `WARNING: ${pred.zoneName} risk elevated to ${pred.riskScore}% — monitoring intensified`,
        source: 'ai-agent',
        timestamp: Date.now(),
        acknowledged: false,
      });
    }

    // River-based alerts
    const affectingRivers = state.relationships.riverAffectsZone
      .filter((r) => r.zoneId === pred.zoneId);
    for (const rel of affectingRivers) {
      const river = state.rivers.get(rel.riverId);
      if (river && river.currentLevel >= river.warningLevel && river.trend === 'rising') {
        newAlerts.push({
          id: `alert-${++alertCounter}`,
          zoneId: pred.zoneId,
          type: river.currentLevel >= river.dangerLevel ? 'critical' : 'warning',
          message: `${river.name} at ${river.currentLevel}m (danger: ${river.dangerLevel}m) — ${river.trend} trend affecting ${pred.zoneName}`,
          source: 'sensor',
          timestamp: Date.now(),
          acknowledged: false,
        });
        break; // one river alert per zone per cycle
      }
    }
  }

  // Social media derived alerts
  const alarmSignals = state.socialSignals.filter(
    (s) => s.sentiment === 'alarm' && Date.now() - s.timestamp < 10000
  );
  if (alarmSignals.length > 0) {
    const signal = alarmSignals[0];
    newAlerts.push({
      id: `alert-${++alertCounter}`,
      zoneId: '',
      type: 'info',
      message: `Social signal: "${signal.content.slice(0, 80)}..."`,
      source: 'social-media',
      timestamp: Date.now(),
      acknowledged: false,
    });
  }

  return newAlerts;
}

export function runPipeline(state: OntologyState): PipelineOutput {
  // 1. Ingest new weather data
  const weatherEvents = generateWeatherEvents();
  for (const event of weatherEvents) {
    state.weather.set(event.id, event);
  }

  // 2. Update river sensors based on upstream weather
  for (const [riverId, river] of state.rivers) {
    const upstreamWeatherIds = state.relationships.weatherImpactsRiver
      .filter((r) => r.riverId === riverId)
      .map((r) => r.weatherEventId);
    const maxRainfall = upstreamWeatherIds
      .map((id) => state.weather.get(id)?.intensity || 0)
      .reduce((max, v) => Math.max(max, v), 0);
    state.rivers.set(riverId, updateRiverSensor(river, maxRainfall));
  }

  // 3. Generate social signals
  const zoneNames = Array.from(state.zones.values()).map((z) => z.name);
  const newSignals = generateSocialSignals(zoneNames, 1 + Math.floor(Math.random() * 2));
  state.socialSignals = [...newSignals, ...state.socialSignals].slice(0, 30);

  // 4. Run AI Agent 1: Risk Predictor
  const predictions = runRiskPredictor(state);

  // 5. Update zone risk scores from predictions
  for (const pred of predictions) {
    const zone = state.zones.get(pred.zoneId);
    if (zone) {
      state.zones.set(pred.zoneId, {
        ...zone,
        riskScore: pred.riskScore,
        riskLevel: pred.riskLevel,
        predictedFloodTime: pred.predictedFloodTime,
        lastUpdated: Date.now(),
      });
    }
  }

  // 6. Update satellite data
  for (const [zoneId, zone] of state.zones) {
    state.satellites.set(zoneId, generateSatelliteData(zoneId, zone.riskScore));
  }

  // 7. Run AI Agent 2: Evacuation Planner
  const evacuation = runEvacuationPlanner(state, predictions);

  // 8. Run AI Agent 3: Resource Allocator
  const resources = runResourceAllocator(predictions, evacuation);

  // 9. Generate alerts
  const newAlerts = generateAlerts(predictions, state);
  state.alerts = [...newAlerts, ...state.alerts].slice(0, 50);

  // Update alert relationships
  for (const alert of newAlerts) {
    if (alert.zoneId) {
      state.relationships.alertLinkedToZone.push({
        alertId: alert.id,
        zoneId: alert.zoneId,
      });
    }
  }

  state.lastPipelineRun = Date.now();

  return { state, predictions, evacuation, resources, newAlerts };
}
