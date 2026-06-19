/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product } from "../../../types";
import { DemandVelocityProjection } from "./types";
import { TimesFMModelAdapter } from "./timesfm-adapter";

export class DemandForecaster {
  private timesFM: TimesFMModelAdapter = new TimesFMModelAdapter();

  /**
   * Predicts future sales demand volumes based on category trends, current inventory velocity,
   * macro pricing multipliers, and seasonality logic.
   */
  public async projectDemandNextPeriod(
    product: Product,
    pricingDeltaPct: number
  ): Promise<DemandVelocityProjection> {
    // Generate simulated timeline history of sales velocity counts (e.g. 90 days past)
    const mockSalesHistory: number[] = Array.from({ length: 90 }, (_, i) => {
      const base = product.salesVelocity30d / 30;
      const noise = (Math.sin((i / 7) * 2 * Math.PI) * 0.2 + 1.0) * (1 + 0.1 * Math.random());
      return Math.max(0, Math.round(base * noise));
    });

    // Compute elasticity penalty based on pricing delta
    const elasticityPenalty = pricingDeltaPct > 0 
      ? Math.max(0.65, 1.0 - (pricingDeltaPct / 100) * 1.5) 
      : Math.min(1.4, 1.0 + (Math.abs(pricingDeltaPct) / 100) * 1.0);

    const timesFMResult = this.timesFM.generateZeroShotForecast(
      product.sku,
      mockSalesHistory,
      elasticityPenalty
    );

    const totalPredictedNext30Days = Math.round(
      timesFMResult.forecastHeads.p50.reduce((a, b) => a + b, 0)
    );

    const prompt = `
      Product: "${product.name}" (SKU: ${product.sku})
      Category: "${product.category}"
      Current Price: ¥${product.currentPrice} | Proposed Price Adjust: ${pricingDeltaPct}%
      TimesFM Patch-Transformer Pre-Projection: ${totalPredictedNext30Days} units.
    `;

    const systemInstruction = "You are the primary forecasting algorithm of AI Commerce OS. Predict 30-day sales velocity and sales trends under pricing variances.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        sku: { type: Type.STRING },
        expectedUnitsNext30Days: { type: Type.NUMBER },
        seasonalityMultiplier: { type: Type.NUMBER },
        predictionConfidenceScore: { type: Type.NUMBER }
      },
      required: ["sku", "expectedUnitsNext30Days", "seasonalityMultiplier", "predictionConfidenceScore"]
    };

    try {
      const gResult = await generateStructuredOutput<DemandVelocityProjection>(prompt, systemInstruction, schema);
      return {
        ...gResult,
        timesFMForecast: timesFMResult
      };
    } catch {
      return {
        sku: product.sku,
        expectedUnitsNext30Days: totalPredictedNext30Days,
        seasonalityMultiplier: 1.12,
        predictionConfidenceScore: Math.round(timesFMResult.zeroShotAccuracyMetrics.trendFidelityScore * 100),
        timesFMForecast: timesFMResult
      };
    }
  }
}

