/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product } from "../../../types";
import { CommercialOpportunity } from "./types";

export class OpportunityDiscoveryEngine {
  /**
   * Proactively scans inventory state, sales velocity, and product metrics to discover high-yield opportunities.
   */
  public async discoverOpportunities(products: Product[]): Promise<CommercialOpportunity[]> {
    const serializedProducts = products.map(p => ({
      sku: p.sku,
      stock: p.inventoryLevel,
      costPrice: p.costPrice,
      currentPrice: p.currentPrice,
      velocity: p.salesVelocity30d
    }));

    const prompt = `
      Perform intelligence scans over the current product list to discover latent commercial revenue and profit opportunities:
      ${JSON.stringify(serializedProducts, null, 2)}
    `;

    const systemInstruction = "You are the Opportunity Discovery Engine of AI Commerce OS. Maintain precise financial estimations.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sku: { type: Type.STRING },
              type: { type: Type.STRING },
              urgencyLevel: { type: Type.STRING },
              estimatedProfitGain: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              suggestedPlanSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "sku", "type", "urgencyLevel", "estimatedProfitGain", "confidenceScore", "suggestedPlanSteps"]
          }
        }
      },
      required: ["opportunities"]
    };

    try {
      const response = await generateStructuredOutput<{ opportunities: CommercialOpportunity[] }>(
        prompt,
        systemInstruction,
        schema
      );
      return response.opportunities;
    } catch {
      // Robust analytical defaults
      const found: CommercialOpportunity[] = [];

      for (const p of products) {
        if (p.inventoryLevel < 15) {
          found.push({
            id: `opp-restock-${p.id}`,
            sku: p.sku,
            type: "INVENTORY_STOCKED_OUT",
            urgencyLevel: "CRITICAL",
            estimatedProfitGain: parseFloat(((p.currentPrice - p.costPrice) * 50).toFixed(2)),
            confidenceScore: 92,
            suggestedPlanSteps: [
              `Initiate restock proposal of 50 units for item ${p.name}`,
              "Check current logistical channel freight delivery rates"
            ]
          });
        }

        if (p.currentPrice > p.costPrice * 2.0 && p.salesVelocity30d > 80) {
          found.push({
            id: `opp-price-${p.id}`,
            sku: p.sku,
            type: "PRICING_OPTIMIZATION",
            urgencyLevel: "HIGH",
            estimatedProfitGain: parseFloat((p.salesVelocity30d * (p.currentPrice * 0.05)).toFixed(2)),
            confidenceScore: 85,
            suggestedPlanSteps: [
              `Perform elastic markdown of 5% on SKU ${p.sku} to capture additional 15% velocity lift`,
              "Validate current competitor floor indexes prior to launching campaign"
            ]
          });
        }
      }

      return found;
    }
  }
}
