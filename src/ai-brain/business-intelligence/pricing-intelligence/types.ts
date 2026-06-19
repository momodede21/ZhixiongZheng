/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricingIntelligenceSummary {
  sku: string;
  recommendedPriceFloor: number;
  elasticityIndex: number;
  competitorIndexMatch: number; // e.g. 1.05
  estimatedMarginPercentageAtOptimal: number;
}
