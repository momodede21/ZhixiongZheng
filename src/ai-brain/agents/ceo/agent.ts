/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { TaskStep } from "../../../types";
import { AgentDecisionPayload } from "./types";

export class CEOAgent {
  /**
   * Strategically signs off or adjusts task allocations before final transactional commits.
   */
  public async authorizeStep(
    step: TaskStep,
    riskScore: number,
    policyAlerts: string[]
  ): Promise<AgentDecisionPayload> {
    const prompt = `
      CEO Review:
      Task: "${step.title}" (Agent: ${step.assignedAgent}, Action: ${step.actionType})
      Risk score: ${riskScore}/10
      Policy Warnings: ${JSON.stringify(policyAlerts)}
      
      Determine if this path represents high commercial efficacy. Decide whether to approve, and write a concise strategic signoff message.
    `;

    const systemInstruction = "You are the autonomous CEO Coordinating Agent of AI Commerce OS. Maintain highly polished corporate focus and high risk threshold discipline.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        approved: { type: Type.BOOLEAN },
        rationale: { type: Type.STRING }
      },
      required: ["approved", "rationale"]
    };

    try {
      const result = await generateStructuredOutput<Omit<AgentDecisionPayload, 'role'>>(prompt, systemInstruction, schema);
      return {
        role: "CEO",
        ...result
      };
    } catch {
      return {
        role: "CEO",
        approved: riskScore < 8,
        rationale: "Default heuristic safety authorization passed."
      };
    }
  }
}
