/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfitOptimizationRange {
  targetMarginPct: number; // e.g. 45 (%)
  recommendedRetailPrice: number;
  totalEstimatedProfitDelta: number;
  allocationUtilityScore: number; // 0.0 to 1.0 (optimization efficiency rank)
}
