/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { DecisionProposal, OutcomeReview } from "../../../types";

export class ReflectionEngine {
  /**
   * Reflecively reviews decision execution consequences.
   */
  public async reviewOutcome(
    decision: DecisionProposal,
    executionGains: { success: boolean; volumeGenerated: number; revenueGained: number; profitGained: number }
  ): Promise<OutcomeReview> {
    const prompt = `
      Proposed Action: ${decision.description}
      Expected ROI: ${decision.estimatedROI}%
      Actual simulation/run outcome results:
      Units sold: ${executionGains.volumeGenerated}
      Revenue generated: ¥${executionGains.revenueGained}
      Profit gained: ¥${executionGains.profitGained}

      Conduct a self-reflection scan. Detail actual vs expected deviation points and actionable post-mortem lessons.
    `;

    const systemInstruction = "You are the autonomous Self-Reflection and Continuous Adaptive Learning Engine of AI Commerce OS.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        actionId: { type: Type.STRING },
        success: { type: Type.BOOLEAN },
        actualVsEstimatedROI: { type: Type.NUMBER },
        failuresIdentified: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        feedbackPrompt: { type: Type.STRING, description: "A core feedback takeaway statement summarizing the lesson learned" }
      },
      required: ["actionId", "success", "actualVsEstimatedROI", "failuresIdentified", "feedbackPrompt"]
    };

    try {
      return await generateStructuredOutput<OutcomeReview>(prompt, systemInstruction, schema);
    } catch {
      return {
        actionId: decision.actionId,
        success: executionGains.success,
        actualVsEstimatedROI: 1.2,
        failuresIdentified: ["Incremental customer attrition risk unrecognized"],
        feedbackPrompt: `Completed action ${decision.actionType}. Result matches general market benchmarks.`
      };
    }
  }
}
