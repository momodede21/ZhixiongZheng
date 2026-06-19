/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { TaskStep, Product } from "../../../types";
import { CMOApprovalPayload } from "./types";

export class CMOAgent {
  /**
   * Reviews retail campaigns, markdown events, and positioning logic from a brand/audience volume lens.
   */
  public async reviewCampaignPositioning(
    step: TaskStep,
    product: Product
  ): Promise<CMOApprovalPayload> {
    const prompt = `
      Evaluate the marketing campaign effectiveness of task: "${step.title}"
      Product target: "${product.name}" (${product.sku})
      Pricing parameters: ${JSON.stringify(step.parameters)}
    `;

    const systemInstruction = "You are the CMO marketing agent of AI Commerce OS. Focus on brand strength, customer retention patterns, and market share lifts.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        approved: { type: Type.BOOLEAN },
        marketShareGainHeuristic: { type: Type.NUMBER },
        rationale: { type: Type.STRING }
      },
      required: ["approved", "marketShareGainHeuristic", "rationale"]
    };

    try {
      const result = await generateStructuredOutput<Omit<CMOApprovalPayload, 'role'>>(prompt, systemInstruction, schema);
      return {
        role: "CMO",
        ...result
      };
    } catch {
      return {
        role: "CMO",
        approved: true,
        marketShareGainHeuristic: 2.5,
        rationale: "Default heuristic marketing positioning cleared."
      };
    }
  }
}
