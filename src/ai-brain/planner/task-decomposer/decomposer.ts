/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, TaskStep } from "../../../types";
import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";

export class TaskDecomposer {
  /**
   * Generates step array for achieving parsed target objectives.
   */
  public async decomposeIntoSteps(
    parsedObjective: string,
    targetMetrics: any,
    products: Product[]
  ): Promise<TaskStep[]> {
    const prompt = `
      Decompose this objective: "${parsedObjective}" with targeted metrics: ${JSON.stringify(targetMetrics)}
      Available products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, currentPrice: p.currentPrice })))}

      Generate logical, sequentially dependent step items.
    `;

    const systemInstruction = "You are the Task Decomposer of AI Commerce OS. Map sequence operations cleanly to proper agents (Pricing, CMO, CFO, Inventory).";

    const schema = {
      type: Type.OBJECT,
      properties: {
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              assignedAgent: { type: Type.STRING, description: "pricing vs inventory vs cmo vs cfo vs CEO" },
              dependencies: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              actionType: { type: Type.STRING },
              parameters: {
                type: Type.OBJECT,
                properties: {
                  targetProductId: { type: Type.STRING },
                  suggestedValue: { type: Type.NUMBER }
                },
                required: ["targetProductId"]
              }
            },
            required: ["id", "title", "assignedAgent", "dependencies", "actionType", "parameters"]
          }
        }
      },
      required: ["steps"]
    };

    try {
      const parsed = await generateStructuredOutput<{ steps: TaskStep[] }>(prompt, systemInstruction, schema);
      return parsed.steps.map(s => ({ ...s, status: "pending" as const }));
    } catch {
      return [
        {
          id: "step-1",
          title: "Audit margins & inventory velocity triggers",
          assignedAgent: "Inventory",
          dependencies: [],
          status: "pending",
          actionType: "MARKET_ANALYSIS",
          parameters: { targetProductId: products[0]?.id || "prod-001" }
        },
        {
          id: "step-2",
          title: "Optimize retail pricing frameworks",
          assignedAgent: "Pricing",
          dependencies: ["step-1"],
          status: "pending",
          actionType: "ADJUST_PRICE",
          parameters: { targetProductId: products[0]?.id || "prod-001", suggestedValue: (products[0]?.currentPrice || 100) * 0.95 }
        }
      ];
    }
  }
}
