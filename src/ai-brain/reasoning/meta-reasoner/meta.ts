/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product } from "../../../types";
import { ReasoningConfidenceMetrics } from "./types";

export class MetaReasoner {
  /**
   * Evaluates if the current analytical logic and facts are reliable enough for financial actions.
   */
  public async reviewReasoningReliability(
    product: Product,
    suggestedAction: string,
    currentEvidenceList: string[]
  ): Promise<ReasoningConfidenceMetrics> {
    const prompt = `
      Evaluate reasoning path and evidence reliability for product ${product.name} (SKU: ${product.sku}).
      Suggested Action: "${suggestedAction}"
      Evidential Base: ${JSON.stringify(currentEvidenceList)}
    `;

    const systemInstruction = "You are the Meta Reasoning & Confidence Self-Evaluation Module of AI Commerce OS. Critically assess if the information is sound, precise and complete or requires more empirical evidence.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        cognitiveConfidencePct: { type: Type.NUMBER },
        evidenceSparingRatio: { type: Type.NUMBER },
        furtherEvidenceRequested: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        suggestedActionPathOverride: { type: Type.STRING },
        isReliable: { type: Type.BOOLEAN }
      },
      required: ["cognitiveConfidencePct", "evidenceSparingRatio", "furtherEvidenceRequested", "isReliable"]
    };

    try {
      return await generateStructuredOutput<ReasoningConfidenceMetrics>(prompt, systemInstruction, schema);
    } catch {
      // Analytical fallback calculations
      const confidence = product.salesVelocity30d > 40 ? 88 : 65;
      const evidenceNeeded = confidence < 80 ? ["Competitor elastic discount historical records", "Upstream logistics peak delay indexes"] : [];

      return {
        cognitiveConfidencePct: confidence,
        evidenceSparingRatio: Number((confidence / 100).toFixed(2)),
        furtherEvidenceRequested: evidenceNeeded,
        isReliable: confidence >= 75,
      };
    }
  }
}
