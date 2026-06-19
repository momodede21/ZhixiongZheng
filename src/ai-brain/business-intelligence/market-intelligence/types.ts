/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketTrendIndex {
  sku: string;
  competitorAverageListedPrice: number;
  macroSearchTrendsLiftPct: number; // Google searches, social buzz index
  sentimentAnalysisScore: number; // 0 to 10
  suggestedSafetyPricingCeiling: number;
}
