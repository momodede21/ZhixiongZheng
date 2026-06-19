/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";
import { PolicyCheckResult } from "./types";

export class PolicyEngine {
  /**
   * Evaluates if proposed pricing adjustments satisfy mandatory cost price margins.
   */
  public verifyCompliance(
    product: Product,
    proposedPrice?: number
  ): PolicyCheckResult {
    if (proposedPrice === undefined) {
      return { policyCompliant: true };
    }

    // Sell below cost price safeguard limit
    if (proposedPrice <= product.costPrice) {
      return {
        policyCompliant: false,
        rejectReason: `Proposed price ¥${proposedPrice} is less than or equal to product cost floor ¥${product.costPrice}!`,
        remedyActionSuggested: `Reset price proposal to a safe threshold (e.g. ¥${(product.costPrice * 1.15).toFixed(2)})`
      };
    }

    // Minimum net margins constraints safeguard limit (15%)
    const proposedMargin = proposedPrice - product.costPrice;
    const marginRatio = proposedMargin / proposedPrice;
    if (marginRatio < 0.15) {
      return {
        policyCompliant: false,
        rejectReason: `Proposed margin ratio (${(marginRatio * 100).toFixed(1)}%) is lower than 15% threshold set by CFO policy rule.`,
        remedyActionSuggested: `Reset price proposal parameters to minimum ¥${(product.costPrice / 0.85).toFixed(2)}`
      };
    }

    return {
      policyCompliant: true
    };
  }
}
