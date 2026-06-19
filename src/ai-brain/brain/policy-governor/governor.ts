/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";
import { CorporatePolicyRules, PolicyCheckResult } from "./types";

export class PolicyGovernorService {
  private rules: CorporatePolicyRules;

  constructor(customRules?: Partial<CorporatePolicyRules>) {
    this.rules = {
      minMarginRatio: 0.20, // 20% default margin requirement
      maxDiscountRatio: 0.35, // Max 35% promotional price drops
      neverSellBelowCost: true, // Never retail below cost base
      restockThresholdQuantity: 15,
      ...customRules,
    };
  }

  public getRules(): CorporatePolicyRules {
    return this.rules;
  }

  public updateRules(newRules: Partial<CorporatePolicyRules>): void {
    this.rules = { ...this.rules, ...newRules };
  }

  /**
   * Evaluates if a price adjustment complies with firm policy regulations.
   */
  public vetPriceAdjustment(product: Product, suggestedPrice: number): PolicyCheckResult {
    const violatedRules: string[] = [];
    const cost = product.costPrice;

    // Minimum margin safety price
    const minMarginPrice = cost / (1 - this.rules.minMarginRatio);
    // Absolute cost safe price floor
    const minCostPrice = this.rules.neverSellBelowCost ? cost : 0;
    // Maximum discount threshold price
    const minDiscountedPrice = product.currentPrice * (1 - this.rules.maxDiscountRatio);

    const absoluteMinAllowed = Math.max(minMarginPrice, minCostPrice, minDiscountedPrice);

    if (suggestedPrice < minCostPrice) {
      violatedRules.push(`CRITICAL_VIOLATION: Suggested price (¥${suggestedPrice}) falls below cost base (¥${cost}).`);
    }

    if (suggestedPrice < minMarginPrice) {
      const actualMarginPct = ((suggestedPrice - cost) / suggestedPrice) * 100;
      violatedRules.push(`MARGIN_VIOLATION: Yields standard gross margin of ${actualMarginPct.toFixed(1)}%, violating minimial threshold limit of ${this.rules.minMarginRatio * 100}%.`);
    }

    if (suggestedPrice < minDiscountedPrice) {
      violatedRules.push(`DISCOUNT_VIOLATION: Markdown size exceeds maximum policy threshold limits of ${this.rules.maxDiscountRatio * 100}%.`);
    }

    const passed = violatedRules.length === 0;

    return {
      passed,
      violatedRules,
      vettedPriceBoundaryAllowed: {
        minAllowedPrice: parseFloat(absoluteMinAllowed.toFixed(2)),
        maxAllowedPrice: parseFloat((product.currentPrice * 1.5).toFixed(2)),
      },
      systemOverrideCode: passed ? undefined : `OVR_POLICY_${Math.floor(Math.random() * 899 + 100)}`,
    };
  }
}
