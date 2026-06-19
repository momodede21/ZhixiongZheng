/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";
import { SafetyCheckResult } from "./types";

export class SafetyGuard {
  /**
   * Hard-stop transactional guard. Overrides toxic loss-leader recommendations.
   */
  public vetTransaction(
    product: Product,
    proposedPrice?: number
  ): SafetyCheckResult {
    if (proposedPrice === undefined) {
      return { blocked: false, overrideApplied: false, message: "No price modification. Safe." };
    }

    // Sell below cost price: HARD STOP
    if (proposedPrice <= product.costPrice) {
      const revisedSafetyPrice = parseFloat((product.costPrice * 1.1).toFixed(2));
      return {
        blocked: false, // Don't block entirely, apply auto-remedy correction
        overrideApplied: true,
        adjustedPriceProposed: revisedSafetyPrice,
        message: `HARD-OVERRIDE: Proposed markdown ¥${proposedPrice} would sell below cost ¥${product.costPrice}. Restructured price safely to cost + 10% premium: ¥${revisedSafetyPrice}`
      };
    }

    return {
      blocked: false,
      overrideApplied: false,
      message: "Satisfies mandatory unit cost safety envelopes."
    };
  }
}
