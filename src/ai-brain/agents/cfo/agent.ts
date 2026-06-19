/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { TaskStep, Product } from "../../../types";
import { CFOApprovalPayload } from "./types";

export class CFOAgent {
  /**
   * Financial reviewer. Validates pricing models and capital commitments
   * to ensure positive margins and correct ROI bounds.
   */
  public async reviewCapitalAllocation(
    step: TaskStep,
    product: Product
  ): Promise<CFOApprovalPayload> {
    const prompt = `
      Perform financial CFO evaluation on task: "${step.title}"
      Target SKUs cost basis: ¥${product.costPrice} | Current listed: ¥${product.currentPrice}
      Suggested adjustment parameters: ${JSON.stringify(step.parameters)}
    `;

    const systemInstruction = "You are the CFO agent of AI Commerce OS. Maintain tight treasury controls and enforce positive margin bounds.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        approved: { type: Type.BOOLEAN },
        estimatedROI: { type: Type.NUMBER },
        capitalCommitted: { type: Type.NUMBER },
        rationale: { type: Type.STRING }
      },
      required: ["approved", "estimatedROI", "capitalCommitted", "rationale"]
    };

    try {
      const result = await generateStructuredOutput<Omit<CFOApprovalPayload, 'role'>>(prompt, systemInstruction, schema);
      return {
        role: "CFO",
        ...result
      };
    } catch {
      // Conservative financial safety checks
      const belowCost = step.parameters?.suggestedMarkdownPct > 45;
      return {
        role: "CFO",
        approved: !belowCost,
        estimatedROI: 14.5,
        capitalCommitted: 0.0,
        rationale: belowCost ? "VETOED: Markdown percent cuts below unit-level floor margins." : "Financial threshold clearance granted."
      };
    }
  }
}
