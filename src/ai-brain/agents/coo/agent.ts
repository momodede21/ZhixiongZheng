/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { TaskStep, Product } from "../../../types";
import { COOApprovalPayload } from "./types";

export class COOAgent {
  /**
   * Reviews retail campaigns, logistics supply chains, and safety product stock margins.
   */
  public async reviewSupplyChainSafety(
    step: TaskStep,
    product: Product
  ): Promise<COOApprovalPayload> {
    const prompt = `
      Evaluate logistics, stockout risks, safety buffer metrics on task: "${step.title}"
      Target Product SKU: ${product.sku}
      Current inventory count: ${product.inventoryLevel} | safety threshold stock: ${product.safetyStock}
    `;

    const systemInstruction = "You are the COO operations agent of AI Commerce OS. Prevent inventory stockouts, maintain supply chain flow, and minimize logistics overhead.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        approved: { type: Type.BOOLEAN },
        stockoutMitigationConfidence: { type: Type.NUMBER },
        rationale: { type: Type.STRING }
      },
      required: ["approved", "stockoutMitigationConfidence", "rationale"]
    };

    try {
      const result = await generateStructuredOutput<Omit<COOApprovalPayload, 'role'>>(prompt, systemInstruction, schema);
      return {
        role: "COO",
        ...result
      };
    } catch {
      const isStockCritical = product.inventoryLevel <= product.safetyStock;
      const requiresMarkdownRestraint = step.actionType === "pricing" && isStockCritical;
      return {
        role: "COO",
        approved: !requiresMarkdownRestraint,
        stockoutMitigationConfidence: 90.0,
        rationale: requiresMarkdownRestraint ? "VETOED: Current stock is critically low. Direct promotions will result in rapid stockout." : "Operational operations signoff cleared."
      };
    }
  }
}
