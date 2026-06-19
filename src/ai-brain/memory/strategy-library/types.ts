/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StrategyStencil {
  strategyId: string;
  name: string;
  description: string;
  contextSeasonality: "SUMMER" | "WINTER" | "SPRING" | "AUTUMN" | "YEAR_ROUND";
  fitCategoryKeywords: string[];
  historicalRoiMultiplier: number; // e.g. 4.2x ROI
  failureRiskPct: number;
  recommendedTacticalProverbs: string[];
}
