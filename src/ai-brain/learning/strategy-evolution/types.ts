/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvolvedStrategyBlueprint {
  optimalBundleSkus: string[];
  suggestedMarkdownLimitPct: number;
  expectedBottomlineMarginLiftScore: number;
  evolutionConfidenceRatio: number;
  tacticalInsightsGenerated: string[];
}
