/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product, TaskStep } from "../../../types";
import { UncertaintyEvaluation } from "./types";

export class UncertaintyEngine {
  /**
   * Estimates model prediction variance, entropy scores, and confidence interval widths
   * for proposed retail policy interventions in dynamic, noisy market models.
   */
  public async assessPlanUncertainty(
    step: TaskStep,
    product: Product
  ): Promise<UncertaintyEvaluation> {
    const prompt = `
      Analyze the structural prediction variance / outcome entropy for the following proposed option:
      Action: "${step.title}"
      Suggested value parameters: ${JSON.stringify(step.parameters)}
      SKU properties: Current retail price ¥${product.currentPrice}, stock levels: ${product.inventoryLevel} items.
    `;

    const systemInstruction = "You are the central Uncertainty Estimation Engine of AI Commerce OS. Analyze outcome standard deviations and entropy parameters.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        confidenceIntervalMin: { type: Type.NUMBER, description: "Lower-bound projection margin lift" },
        confidenceIntervalMax: { type: Type.NUMBER, description: "Upper-bound projection margin lift" },
        entropyScore: { type: Type.NUMBER, description: "Entropy degree between 0.0 and 1.0" },
        volatilityPremiumRatio: { type: Type.NUMBER, description: "Suggested protective margin pricing buffer ratio (e.g. 0.05)" },
        mitigationRequired: { type: Type.BOOLEAN }
      },
      required: ["confidenceIntervalMin", "confidenceIntervalMax", "entropyScore", "volatilityPremiumRatio", "mitigationRequired"]
    };

    try {
      return await generateStructuredOutput<UncertaintyEvaluation>(prompt, systemInstruction, schema);
    } catch {
      return {
        confidenceIntervalMin: -5,
        confidenceIntervalMax: 15,
        entropyScore: 0.35,
        volatilityPremiumRatio: 0.02,
        mitigationRequired: false
      };
    }
  }
}
