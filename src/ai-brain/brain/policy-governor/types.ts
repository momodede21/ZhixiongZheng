/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CorporatePolicyRules {
  minMarginRatio: number; // e.g. 0.20 (20%)
  maxDiscountRatio: number; // e.g. 0.35 (35%)
  neverSellBelowCost: boolean;
  restockThresholdQuantity: number;
}

export interface PolicyCheckResult {
  passed: boolean;
  violatedRules: string[];
  vettedPriceBoundaryAllowed: { minAllowedPrice: number; maxAllowedPrice: number };
  systemOverrideCode?: string;
}
