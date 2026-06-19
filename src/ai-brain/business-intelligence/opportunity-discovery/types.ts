/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommercialOpportunity {
  id: string;
  sku: string;
  type: "PRICING_OPTIMIZATION" | "INVENTORY_STOCKED_OUT" | "BUNDLE_PROMOTION" | "TREND_CROSS_SELL";
  urgencyLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOGISTICAL_LOW";
  estimatedProfitGain: number;
  confidenceScore: number;
  suggestedPlanSteps: string[];
}
