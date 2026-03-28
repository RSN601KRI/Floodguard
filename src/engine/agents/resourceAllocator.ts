/**
 * AI Agent 3: Resource Allocator
 * Determines optimal resource deployment based on risk and evacuation needs.
 */

import type { EvacuationSummary } from './evacuationPlanner';
import type { ZoneRiskPrediction } from './riskPredictor';

export interface ResourceDeployment {
  zoneId: string;
  zoneName: string;
  boats: number;
  ndrfTeams: number;
  medicalTeams: number;
  reliefKits: number;
  foodPackets: number;
  actionStatement: string;
}

export interface ResourceAllocationResult {
  deployments: ResourceDeployment[];
  totals: {
    boats: number;
    ndrfTeams: number;
    medicalTeams: number;
    reliefKits: number;
    foodPackets: number;
  };
  capacityUtilization: number; // 0-1
  decisions: string[];         // Human-readable decisions
}

// Available resources (system capacity)
const CAPACITY = {
  boats: 150,
  ndrfTeams: 12,
  medicalTeams: 20,
  reliefKits: 50000,
  foodPackets: 300000,
};

export function runResourceAllocator(
  predictions: ZoneRiskPrediction[],
  evacuation: EvacuationSummary
): ResourceAllocationResult {
  const deployments: ResourceDeployment[] = [];
  const decisions: string[] = [];

  const highRiskZones = predictions.filter((p) => p.riskScore >= 50);

  // Allocate proportionally based on risk score
  const totalRisk = highRiskZones.reduce((s, z) => s + z.riskScore, 0);

  for (const zone of highRiskZones) {
    const riskShare = totalRisk > 0 ? zone.riskScore / totalRisk : 0;
    const evacPlan = evacuation.activePlans.find((p) => p.zoneId === zone.zoneId);
    const evacuees = evacPlan?.peopleToEvacuate || 0;

    // Boats: based on population at risk and flood severity
    const boats = Math.max(2, Math.round(CAPACITY.boats * riskShare));

    // NDRF: at least 1 team per high-risk zone
    const ndrfTeams = zone.riskScore >= 70
      ? Math.max(2, Math.round(CAPACITY.ndrfTeams * riskShare))
      : zone.riskScore >= 50 ? 1 : 0;

    // Medical teams: proportional to vulnerable population
    const medicalTeams = Math.max(1, Math.round(CAPACITY.medicalTeams * riskShare));

    // Relief kits: 1 per 3 evacuees
    const reliefKits = Math.round(evacuees / 3);

    // Food packets: 3 per evacuee per day, plan for 3 days
    const foodPackets = evacuees * 3 * 3;

    const actionStatement = `Deploy ${boats} boats, ${ndrfTeams} NDRF teams, and ${medicalTeams} medical units to ${zone.zoneName}. Prepare ${reliefKits.toLocaleString()} relief kits.`;

    deployments.push({
      zoneId: zone.zoneId,
      zoneName: zone.zoneName,
      boats,
      ndrfTeams,
      medicalTeams,
      reliefKits,
      foodPackets,
      actionStatement,
    });

    if (zone.riskScore >= 75) {
      decisions.push(`Deploy ${boats} boats to ${zone.zoneName} immediately`);
    }
    if (ndrfTeams >= 2) {
      decisions.push(`${ndrfTeams} NDRF teams en route to ${zone.zoneName}`);
    }
  }

  const totals = {
    boats: deployments.reduce((s, d) => s + d.boats, 0),
    ndrfTeams: deployments.reduce((s, d) => s + d.ndrfTeams, 0),
    medicalTeams: deployments.reduce((s, d) => s + d.medicalTeams, 0),
    reliefKits: deployments.reduce((s, d) => s + d.reliefKits, 0),
    foodPackets: deployments.reduce((s, d) => s + d.foodPackets, 0),
  };

  const capacityUtilization = Math.min(1, totals.boats / CAPACITY.boats);

  // Generate high-level decisions
  if (evacuation.totalPeopleAtRisk > 50000) {
    decisions.unshift(`CRITICAL: ${evacuation.totalPeopleAtRisk.toLocaleString()} people at risk — activate state-level response`);
  }
  if (totals.boats > CAPACITY.boats * 0.8) {
    decisions.push('Resource strain: Request additional boats from neighboring districts');
  }

  return {
    deployments: deployments.sort((a, b) => b.boats - a.boats),
    totals,
    capacityUtilization,
    decisions,
  };
}
