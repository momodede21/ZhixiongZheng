/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product } from "../../../types";
import { PricingIntelligenceSummary } from "./types";

export class PricingIntelligenceService {
  /**
   * Provides deep pricing intelligence analytics, matching cost bases against competitive indexes.
   */
  public async computePricingIntelligence(
    product: Product,
    competitorAvgPrice: number
  ): Promise<PricingIntelligenceSummary> {
    const prompt = `
      Product SKU: ${product.sku}
      Cost focus floor: ¥${product.costPrice} | Current: ¥${product.currentPrice}
      Competitor average listed match: ¥${competitorAvgPrice}
    `;

    const systemInstruction = "You are the pricing intelligence component of AI Commerce OS. Maintain highly safe margin allocations.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        sku: { type: Type.STRING },
        recommendedPriceFloor: { type: Type.NUMBER },
        elasticityIndex: { type: Type.NUMBER },
        competitorIndexMatch: { type: Type.NUMBER },
        estimatedMarginPercentageAtOptimal: { type: Type.NUMBER }
      },
      required: ["sku", "recommendedPriceFloor", "elasticityIndex", "competitorIndexMatch", "estimatedMarginPercentageAtOptimal"]
    };

    try {
      return await generateStructuredOutput<PricingIntelligenceSummary>(prompt, systemInstruction, schema);
    } catch {
      const recommendedPriceFloor = product.costPrice * 1.12;
      return {
        sku: product.sku,
        recommendedPriceFloor,
        elasticityIndex: -2.0,
        competitorIndexMatch: parseFloat((product.currentPrice / competitorAvgPrice).toFixed(2)),
        estimatedMarginPercentageAtOptimal: parseFloat((((product.currentPrice - product.costPrice) / product.currentPrice) * 100).toFixed(1))
      };
    }
  }
}
