/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { MetaRoutingResult } from "./types";

export class MetaController {
  /**
   * Strategically routes prompts, budget allocations and computational limits
   * based on objective density and urgency constraints.
   */
  public async computeMetaRouting(
    objective: string,
    historyLength: number
  ): Promise<MetaRoutingResult> {
    const prompt = `
      Objective text: "${objective}"
      Historical Event Count: ${historyLength}
      
      Determine the meta-routing priority of this operation:
      - Which cognitive engine requires the highest allocation? ("planner", "reasoner", "decision", "reflection")
      - What is the designated LLM token upper-bound budget?
      - How deep should multi-agent reflective planning tree search run (depth limit 1-5)?
    `;

    const systemInstruction = "You are the central Meta-Controller of AI Commerce OS. Allocate computational budgets and task routers dynamically with high economic reasoning.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        focusEngine: { type: Type.STRING, description: "Must be 'planner', 'reasoner', 'decision' or 'reflection'" },
        tokenBudget: { type: Type.NUMBER },
        depthLimit: { type: Type.NUMBER },
        rationale: { type: Type.STRING }
      },
      required: ["focusEngine", "tokenBudget", "depthLimit", "rationale"]
    };

    try {
      const result = await generateStructuredOutput<any>(prompt, systemInstruction, schema);
      return {
        focusEngine: ["planner", "reasoner", "decision", "reflection"].includes(result.focusEngine)
          ? result.focusEngine
          : "reasoner",
        tokenBudget: result.tokenBudget || 5000,
        depthLimit: result.depthLimit || 3,
        rationale: result.rationale || "Auto-computed routing defaults."
      };
    } catch {
      return {
        focusEngine: "reasoner",
        tokenBudget: 5000,
        depthLimit: 3,
        rationale: "Static fallback routing active."
      };
    }
  }
}
