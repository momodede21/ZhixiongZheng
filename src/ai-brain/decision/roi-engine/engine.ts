/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { generateStructuredOutput } from "../../llm";
import { Type } from "@google/genai";
import { Product, TaskStep } from "../../../types";
import { ROIEstimation } from "./types";

export class ROIEngine {
  /**
   * Assesses direct ROI prospects based on historical costs and catalog state.
   */
  public async estimateActionROI(
    step: TaskStep,
    product: Product
  ): Promise<ROIEstimation> {
    const prompt = `
      Action Type: ${step.actionType}
      Parameters: ${JSON.stringify(step.parameters)}
      Product cost/price properties: Unit cost ¥${product.costPrice}, price ¥${product.currentPrice}
      
      Suggest estimated campaign overhead costs, estimated gross revenue lift percentage and absolute ROI metric details.
    `;

    const systemInstruction = "You are the advanced ROI estimation engine of AI Commerce OS. Conduct standard quantitative campaign audit checks.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        estimatedROI: { type: Type.NUMBER },
        estimatedCost: { type: Type.NUMBER },
        revenueLiftProjection: { type: Type.NUMBER }
      },
      required: ["estimatedROI", "estimatedCost", "revenueLiftProjection"]
    };

    try {
      return await generateStructuredOutput<ROIEstimation>(prompt, systemInstruction, schema);
    } catch {
      return {
        estimatedROI: 14.5,
        estimatedCost: 100,
        revenueLiftProjection: 1100
      };
    }
  }
}
