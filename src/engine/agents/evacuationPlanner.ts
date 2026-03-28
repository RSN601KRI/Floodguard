/**
 * AI Agent 2: Evacuation Planner
 * Generates evacuation plans when risk exceeds thresholds.
 */

import type { OntologyState } from '../ontology';
import type { ZoneRiskPrediction } from './riskPredictor';

export interface EvacuationPlan {
  zoneId: string;
  zoneName: string;
  priority: 'immediate' | 'urgent' | 'standby';
  peopleToEvacuate: number;
  vulnerableFirst: number;
  estimatedTimeHours: number;
  suggestedRoutes: string[];
  shelterCapacityNeeded: number;
  vehiclesRequired: number;
  actionStatement: string;
}

export interface EvacuationSummary {
  activePlans: EvacuationPlan[];
  totalPeopleAtRisk: number;
  totalVehiclesNeeded: number;
  totalShelterCapacity: number;
}

const EVACUATION_THRESHOLD = 55;
const IMMEDIATE_THRESHOLD = 75;

const ROUTE_DATABASE: Record<string, string[]> = {
  'zone-a': ['NH-30 South', 'SH-1 West', 'Gandhi Setu Alt'],
  'zone-b': ['NH-57 Alt', 'SH-73 North', 'Muzaffarpur Ring Road'],
  'zone-c': ['NH-57 East', 'District Road 12', 'Darbhanga Bypass'],
  'zone-d': ['NH-80 West', 'SH-5 South', 'Bhagalpur-Munger Road'],
  'zone-e': ['NH-107 South', 'District Road 4', 'Saharsa-Supaul Road'],
  'zone-f': ['NH-28 East', 'SH-7 North', 'Begusarai Ring Road'],
  'zone-g': ['NH-80 East', 'District Road 8', 'Munger Fort Road'],
};

export function runEvacuationPlanner(
  state: OntologyState,
  predictions: ZoneRiskPrediction[]
): EvacuationSummary {
  const activePlans: EvacuationPlan[] = [];

  for (const pred of predictions) {
    if (pred.riskScore < EVACUATION_THRESHOLD) continue;

    const pop = state.population.get(pred.zoneId);
    if (!pop) continue;

    const isImmediate = pred.riskScore >= IMMEDIATE_THRESHOLD;
    const priority: EvacuationPlan['priority'] = isImmediate ? 'immediate' : pred.riskScore >= 65 ? 'urgent' : 'standby';

    // Calculate evacuation scale based on risk and population
    const evacuationRatio = isImmediate ? 0.4 : pred.riskScore >= 65 ? 0.25 : 0.1;
    const peopleToEvacuate = Math.round(pop.total * evacuationRatio);
    const vulnerableFirst = Math.round(pop.vulnerable * (isImmediate ? 0.8 : 0.5));

    // Vehicle estimation: 1 vehicle per ~30 people
    const vehiclesRequired = Math.ceil(peopleToEvacuate / 30);

    // Time estimation based on population and priority
    const estimatedTimeHours = isImmediate
      ? Math.max(1, Math.round(peopleToEvacuate / 15000))
      : Math.max(3, Math.round(peopleToEvacuate / 8000));

    const routes = ROUTE_DATABASE[pred.zoneId] || ['Primary evacuation route'];

    const actionStatement = `Evacuate ${peopleToEvacuate.toLocaleString()} people from ${pred.zoneName} within ${estimatedTimeHours} hours. Priority: ${vulnerableFirst.toLocaleString()} vulnerable persons first.`;

    activePlans.push({
      zoneId: pred.zoneId,
      zoneName: pred.zoneName,
      priority,
      peopleToEvacuate,
      vulnerableFirst,
      estimatedTimeHours,
      suggestedRoutes: routes,
      shelterCapacityNeeded: Math.ceil(peopleToEvacuate * 1.1), // 10% buffer
      vehiclesRequired,
      actionStatement,
    });
  }

  return {
    activePlans: activePlans.sort((a, b) => {
      const priorityOrder = { immediate: 0, urgent: 1, standby: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    totalPeopleAtRisk: activePlans.reduce((s, p) => s + p.peopleToEvacuate, 0),
    totalVehiclesNeeded: activePlans.reduce((s, p) => s + p.vehiclesRequired, 0),
    totalShelterCapacity: activePlans.reduce((s, p) => s + p.shelterCapacityNeeded, 0),
  };
}
