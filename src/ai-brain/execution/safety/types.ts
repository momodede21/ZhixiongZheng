/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SafetyCheckResult {
  blocked: boolean;
  overrideApplied: boolean;
  adjustedPriceProposed?: number;
  message: string;
}
