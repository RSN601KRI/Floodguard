import { useState, useEffect, useRef, useCallback } from 'react';
import { createInitialOntology, type OntologyState } from '../engine/ontology';
import { runPipeline, type PipelineOutput } from '../engine/pipeline';
import { setCrisisMode } from '../engine/dataSources';
import type { ZoneRiskPrediction } from '../engine/agents/riskPredictor';
import type { EvacuationSummary } from '../engine/agents/evacuationPlanner';
import type { ResourceAllocationResult } from '../engine/agents/resourceAllocator';

interface FloodEngineState {
  ontology: OntologyState;
  predictions: ZoneRiskPrediction[];
  evacuation: EvacuationSummary;
  resources: ResourceAllocationResult;
  pipelineRunCount: number;
  isRunning: boolean;
}

const PIPELINE_INTERVAL_MS = 4000;

export function useFloodEngine() {
  const stateRef = useRef<OntologyState>(createInitialOntology());
  const [engineState, setEngineState] = useState<FloodEngineState>(() => {
    const initial = runPipeline(stateRef.current);
    return {
      ontology: initial.state,
      predictions: initial.predictions,
      evacuation: initial.evacuation,
      resources: initial.resources,
      pipelineRunCount: 1,
      isRunning: true,
    };
  });

  const setSimulationMode = useCallback((active: boolean) => {
    setCrisisMode(active);
  }, []);

  const tick = useCallback(() => {
    const output = runPipeline(stateRef.current);
    stateRef.current = output.state;
    setEngineState((prev) => ({
      ontology: output.state,
      predictions: output.predictions,
      evacuation: output.evacuation,
      resources: output.resources,
      pipelineRunCount: prev.pipelineRunCount + 1,
      isRunning: prev.isRunning,
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, PIPELINE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tick]);

  const zones = Array.from(engineState.ontology.zones.values()).map((zone) => ({
    ...zone,
    risk: zone.riskLevel === 'high' ? 'high' as const : zone.riskLevel === 'medium' ? 'moderate' as const : 'safe' as const,
    population: engineState.ontology.population.get(zone.id)?.total || 0,
    riverLevel: (() => {
      const rel = engineState.ontology.relationships.riverAffectsZone.find((r) => r.zoneId === zone.id);
      return rel ? engineState.ontology.rivers.get(rel.riverId)?.currentLevel || 0 : 0;
    })(),
    rainfall: (() => {
      const rel = engineState.ontology.relationships.riverAffectsZone.find((r) => r.zoneId === zone.id);
      if (!rel) return 0;
      const weatherRel = engineState.ontology.relationships.weatherImpactsRiver.find((w) => w.riverId === rel.riverId);
      return weatherRel ? engineState.ontology.weather.get(weatherRel.weatherEventId)?.intensity || 0 : 0;
    })(),
  }));

  const alerts = engineState.ontology.alerts.map((a) => {
    const timeDiff = Date.now() - a.timestamp;
    const timeStr = timeDiff < 60000 ? `${Math.round(timeDiff / 1000)}s ago`
      : timeDiff < 3600000 ? `${Math.round(timeDiff / 60000)} min ago`
        : `${Math.round(timeDiff / 3600000)}h ago`;
    return {
      id: a.id,
      message: a.message,
      type: a.type,
      timestamp: timeStr,
      zone: a.zoneId,
      source: a.source,
    };
  });

  const systemStatus = (() => {
    const highRiskCount = engineState.predictions.filter((p) => p.riskLevel === 'high').length;
    if (highRiskCount >= 3) return 'Critical' as const;
    if (highRiskCount >= 1) return 'Elevated' as const;
    return 'Stable' as const;
  })();

  return {
    ...engineState,
    zones,
    alerts,
    systemStatus,
    rivers: Array.from(engineState.ontology.rivers.values()),
    socialSignals: engineState.ontology.socialSignals,
    setSimulationMode,
  };
}
