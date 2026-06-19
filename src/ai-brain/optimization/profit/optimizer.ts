/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";
import { ProfitOptimizationRange } from "./types";

export class ProfitOptimizer {
  /**
   * Identifies ideal gross product pricing matrices to optimize bottomline net-margin and retail returns.
   */
  public optimizeRetailProfits(
    product: Product,
    historicalVelocity: number
  ): ProfitOptimizationRange {
    const cost = product.costPrice;
    const current = product.currentPrice;

    // Standard high margin target default model
    const calculatedTargetPrice = current * 0.98; // test slight margin reduction for volume boost
    const marginAmount = calculatedTargetPrice - cost;
    const targetMarginPct = parseFloat(((marginAmount / calculatedTargetPrice) * 100).toFixed(1));

    // Project estimated profit lift from optimization curve
    const predictedNewVelocity = Math.round(historicalVelocity * 1.15);
    const originalMonthlyProfit = (current - cost) * historicalVelocity;
    const projectNewMonthlyProfit = marginAmount * predictedNewVelocity;
    const totalEstimatedProfitDelta = projectNewMonthlyProfit - originalMonthlyProfit;

    return {
      targetMarginPct,
      recommendedRetailPrice: parseFloat(calculatedTargetPrice.toFixed(2)),
      totalEstimatedProfitDelta: parseFloat(totalEstimatedProfitDelta.toFixed(2)),
      allocationUtilityScore: targetMarginPct > 35 ? 0.92 : 0.65
    };
  }
}
