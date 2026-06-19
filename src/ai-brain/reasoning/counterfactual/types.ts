/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CounterfactualSimulation {
  scenarioName: string;
  priceLevel: number;
  expectedRevenue: number;
  expectedProfit: number;
  marketShareImpactPct: number;
  regretScore: number; // calculated opportunity regret metric (0.0 to 100.0)
}

export interface CounterfactualAnalysis {
  chosenActionPath: string;
  alternativeSimulations: CounterfactualSimulation[];
  optimalPathRegretDifference: number;
  remedyAdjustmentsRecommended: string[];
}
