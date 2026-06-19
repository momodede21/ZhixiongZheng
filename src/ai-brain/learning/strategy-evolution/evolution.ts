/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { EvolvedStrategyBlueprint } from "./types";
import { Product } from "../../../types";

export class StrategyEvolutionEngine {
  /**
   * Refines future strategy rule triggers by examining reflection outcomes and historical SKU sales velocity.
   */
  public generateEvolvedTactics(
    activeProducts: Product[],
    historicalReflectionRatio: number
  ): EvolvedStrategyBlueprint {
    // Find high velocity products for coupling
    const sortedVelocity = [...activeProducts].sort((a, b) => b.salesVelocity30d - a.salesVelocity30d);
    const primaryBundleSKU = sortedVelocity[0]?.sku || "SKU-H12";
    const accessorySKU = sortedVelocity[1]?.sku || "SKU-ACC-03";

    const baseMarkdownLimit = 15;
    const markdownAdjustment = historicalReflectionRatio > 0.5 ? 5 : -2;

    return {
      optimalBundleSkus: [primaryBundleSKU, accessorySKU],
      suggestedMarkdownLimitPct: Math.max(5, Math.min(30, baseMarkdownLimit + markdownAdjustment)),
      expectedBottomlineMarginLiftScore: 12.5,
      evolutionConfidenceRatio: 0.88,
      tacticalInsightsGenerated: [
        `Bundle fast-moving ${primaryBundleSKU} with higher margin ${accessorySKU} to capture cross-channel margin growth.`,
        "Utilize smart Markdown boundaries in winter transition windows based on inventory load peaks.",
      ],
    };
  }
}
