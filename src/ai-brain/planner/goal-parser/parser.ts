/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Goal } from "../../../types";

export class GoalParser {
  /**
   * Parses raw unstructured goals into strictly defined structured business objectives.
   */
  public async parseGoal(rawGoalText: string): Promise<Goal> {
    const prompt = `Translate this raw objective into deep metric objectives: "${rawGoalText}"`;
    const systemInstruction = "You are the Goal Parser of AI Commerce OS. Deconstruct high-level goals into target goals and policy constraints.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        parsedObjective: { type: Type.STRING },
        targetMetrics: {
          type: Type.OBJECT,
          properties: {
            marginIncrease: { type: Type.NUMBER },
            revealIncrease: { type: Type.NUMBER },
            sellThroughRate: { type: Type.NUMBER },
            inventoryRotation: { type: Type.NUMBER }
          }
        },
        constraints: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        priority: { type: Type.STRING, description: "Must be high, medium or low" }
      },
      required: ["parsedObjective", "targetMetrics", "constraints", "priority"]
    };

    try {
      const parsed = await generateStructuredOutput<Omit<Goal, 'id' | 'rawText'>>(prompt, systemInstruction, schema);
      return {
        id: "goal-" + Date.now(),
        rawText: rawGoalText,
        ...parsed
      };
    } catch {
      return {
        id: "goal-" + Date.now(),
        rawText: rawGoalText,
        parsedObjective: rawGoalText,
        targetMetrics: { marginIncrease: 10 },
        constraints: ["Maintain healthy margins above unit cost floors"],
        priority: "medium"
      };
    }
  }
}
