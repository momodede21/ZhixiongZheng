/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product } from "../../../types";
import { CounterfactualAnalysis } from "./types";

export class CounterfactualReasoner {
  /**
   * Run "What-If-We-Had-Done-Otherwise" analysis. Compare the chosen price with baseline high/low counterfactuals.
   */
  public async compareCounterfactualPaths(
    product: Product,
    currentChosenPrice: number
  ): Promise<CounterfactualAnalysis> {
    const prompt = `
      Evaluate counterfactual price paths for ${product.name} (SKU: ${product.sku}).
      Current chosen Price: ¥${currentChosenPrice}
      Product Cost Base: ¥${product.costPrice}
    `;

    const systemInstruction = "You are the Counterfactual Reasoning Engine of the AI Commerce OS. Measure retrospective regret metrics across alternative historical decision forks.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        chosenActionPath: { type: Type.STRING },
        alternativeSimulations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              scenarioName: { type: Type.STRING },
              priceLevel: { type: Type.NUMBER },
              expectedRevenue: { type: Type.NUMBER },
              expectedProfit: { type: Type.NUMBER },
              marketShareImpactPct: { type: Type.NUMBER },
              regretScore: { type: Type.NUMBER }
            },
            required: ["scenarioName", "priceLevel", "expectedRevenue", "expectedProfit", "marketShareImpactPct", "regretScore"]
          }
        },
        optimalPathRegretDifference: { type: Type.NUMBER },
        remedyAdjustmentsRecommended: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["chosenActionPath", "alternativeSimulations", "optimalPathRegretDifference", "remedyAdjustmentsRecommended"]
    };

    try {
      return await generateStructuredOutput<CounterfactualAnalysis>(prompt, systemInstruction, schema);
    } catch {
      // Algebraic fallback models for counterfactual evaluation
      const currentChosenProfit = (currentChosenPrice - product.costPrice) * product.salesVelocity30d;
      const competitorPrice = currentChosenPrice * 1.05;

      const higherPrice = currentChosenPrice * 1.15;
      const higherSales = product.salesVelocity30d * 0.7; // higher price, lower volume
      const higherProfit = (higherPrice - product.costPrice) * higherSales;

      const discountPrice = currentChosenPrice * 0.9;
      const discountSales = product.salesVelocity30d * 1.4; // lower price, higher volume
      const discountProfit = (discountPrice - product.costPrice) * discountSales;

      return {
        chosenActionPath: `Keep price around ¥${currentChosenPrice}`,
        alternativeSimulations: [
          {
            scenarioName: "Aggressive Premium Markup (+15%)",
            priceLevel: parseFloat(higherPrice.toFixed(2)),
            expectedRevenue: parseFloat((higherPrice * higherSales).toFixed(2)),
            expectedProfit: parseFloat(higherProfit.toFixed(2)),
            marketShareImpactPct: -5,
            regretScore: higherProfit > currentChosenProfit ? 25 : 0
          },
          {
            scenarioName: "Promotional Markdown (-10%)",
            priceLevel: parseFloat(discountPrice.toFixed(2)),
            expectedRevenue: parseFloat((discountPrice * discountSales).toFixed(2)),
            expectedProfit: parseFloat(discountProfit.toFixed(2)),
            marketShareImpactPct: 12,
            regretScore: discountProfit > currentChosenProfit ? 15 : 0
          }
        ],
        optimalPathRegretDifference: Math.abs(parseFloat((Math.max(higherProfit, discountProfit, currentChosenProfit) - currentChosenProfit).toFixed(2))),
        remedyAdjustmentsRecommended: [
          "Establish price floor boundaries at ¥" + (product.costPrice * 1.15).toFixed(2) + " to maintain security margins.",
          "Coordinate volume sales through bundling rather than deep point markdown price splits."
        ]
      };
    }
  }
}
