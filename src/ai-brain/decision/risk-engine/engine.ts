/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product, TaskStep } from "../../../types";
import { RiskAnalysis } from "./types";

export class RiskEngine {
  /**
   * Evaluates pricing degradation risks and competitor matching outcomes.
   */
  public async assessStrategicRisk(
    step: TaskStep,
    product: Product
  ): Promise<RiskAnalysis> {
    const prompt = `
      Assess execution plan risks for SKU: ${product.sku}
      Action Type: ${step.actionType}
      Suggested Price Value: ¥${step.parameters.suggestedValue || "N/A"}
      Current Level: ${product.inventoryLevel} items
    `;

    const systemInstruction = "You are the advanced Risk Engine of AI Commerce OS. Score risks from 1 (low) to 10 (very high risk) and give immediate mitigation heuristics.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        riskScore: { type: Type.NUMBER },
        riskDescription: { type: Type.STRING },
        mitigationHeuristic: { type: Type.STRING }
      },
      required: ["riskScore", "riskDescription", "mitigationHeuristic"]
    };

    try {
      return await generateStructuredOutput<RiskAnalysis>(prompt, systemInstruction, schema);
    } catch {
      return {
        riskScore: 3,
        riskDescription: "Medium baseline risk of campaign margin degradation.",
        mitigationHeuristic: "Deploy price markdown incrementally in segments."
      };
    }
  }
}
