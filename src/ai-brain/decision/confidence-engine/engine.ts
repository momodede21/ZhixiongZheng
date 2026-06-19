/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemConfidenceMetric } from "./types";

export class ConfidenceEngine {
  /**
   * Evaluates aggregate executive decisions or pricing interventions to yield confidence grades.
   * Leverages riskScores, standard deviation bounds, and entropy coefficients.
   */
  public evaluateOverallConfidence(
    riskScore: number,
    entropyScore: number,
    volatilityPremium: number,
    policyCompliance: boolean
  ): SystemConfidenceMetric {
    // Basic structural formula matching deep reasoning constraints
    const riskFactor = (10 - riskScore) * 10; // e.g. risk level 2 has base confidence of 80%
    const entropyFactor = (1 - entropyScore) * 20; // lower entropy boosts confidence
    const premiumBufferCorrection = (1 - volatilityPremium) * 10.0;

    let confidenceCoefficient = parseFloat((riskFactor + entropyFactor + premiumBufferCorrection).toFixed(1));
    if (confidenceCoefficient < 0) confidenceCoefficient = 0;
    if (confidenceCoefficient > 100) confidenceCoefficient = 100;

    const recommendationOverrideNeeded = confidenceCoefficient < 55.0;
    const strategicConstraintSatisfied = policyCompliance && !recommendationOverrideNeeded;

    let governanceSignificance: "standard" | "critical" | "high-risk-veto" = "standard";
    if (riskScore >= 7) {
      governanceSignificance = "high-risk-veto";
    } else if (riskScore >= 4) {
      governanceSignificance = "critical";
    }

    return {
      confidenceCoefficient,
      recommendationOverrideNeeded,
      strategicConstraintSatisfied,
      governanceSignificance
    };
  }
}
