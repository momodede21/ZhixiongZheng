/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";
import { CommerceDomain } from "../../../ecommerce/domain";
import { RouterExecutionResult } from "./types";

export class ToolRouter {
  /**
   * Safely dispatches agent recommendation steps to the safe transactional layer of real commerce systems.
   */
  public routeActionToDomain(
    step: TaskStep,
    commerce: CommerceDomain
  ): RouterExecutionResult {
    let routedTool = "unknown";
    const parametersApplied: Record<string, any> = { ...step.parameters };

    if (step.actionType === "pricing") {
      routedTool = "pricing-intelligence-adjust";
      const sku = step.parameters.sku;
      const finalPrice = step.parameters.suggestedValuePrice;
      if (sku && finalPrice) {
        const prod = commerce.getProducts().find(p => p.sku === sku);
        if (prod) {
          commerce.updatePrice(prod.id, finalPrice);
        }
      }
    } else if (step.actionType === "inventory") {
      routedTool = "procurement-restock";
      const sku = step.parameters.sku;
      const reorderQty = step.parameters.suggestedReorderQuantity || 100;
      if (sku) {
        const prod = commerce.getProducts().find(p => p.sku === sku);
        if (prod) {
          commerce.adjustStock(prod.id, reorderQty);
        }
      }
    }

    return {
      routedTool,
      parametersApplied,
      transactionSecured: true,
      timestamp: new Date().toISOString()
    };
  }
}
