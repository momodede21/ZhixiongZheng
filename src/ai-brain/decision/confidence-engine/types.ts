/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemConfidenceMetric {
  confidenceCoefficient: number; // 0.0 - 100.0 (high index values represent low risk certainty)
  recommendationOverrideNeeded: boolean;
  strategicConstraintSatisfied: boolean;
  governanceSignificance: "standard" | "critical" | "high-risk-veto";
}
