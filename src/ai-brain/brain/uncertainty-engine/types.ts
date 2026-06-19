/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UncertaintyEvaluation {
  confidenceIntervalMin: number;
  confidenceIntervalMax: number;
  entropyScore: number; // 0.0 to 1.0 (lower means higher security, clear outcome prediction)
  volatilityPremiumRatio: number; // calculated surcharge premium due to uncertainty
  mitigationRequired: boolean;
}
