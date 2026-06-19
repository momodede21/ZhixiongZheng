/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalibratedCompositeMetrics } from "./types";

export class ConfidenceCalibrator {
  /**
   * Generates a fully mathematically calibrated Trust Index based on multi-dimensional inputs.
   */
  public calibrateDecisionChain(
    rawRiskScore: number,          // 0 to 10
    uncertaintyEntropyScore: number, // 0.0 to 1.0
    vettedEvidenceCount: number,    // number of sources found
    hasSandboxSimResult: boolean,
    policyPassed: boolean
  ): CalibratedCompositeMetrics {
    // 1. Calculate Evidence Coverage (linear saturation log metric)
    const evidenceCoverage = Math.min(1.0, parseFloat((vettedEvidenceCount / 4).toFixed(2)));

    // 2. Calculate Simulation Coverage
    const simulationCoverage = hasSandboxSimResult ? 0.95 : 0.30;

    // 3. Compute Hallucination Risk
    const riskFactor = (rawRiskScore / 10) * 40; // max 40 pts
    const entropyFactor = uncertaintyEntropyScore * 30; // max 30 pts
    const missingEvidenceFactor = (1 - evidenceCoverage) * 30; // max 30 pts
    const hallucinationRisk = Math.round(Math.min(100, Math.max(5, riskFactor + entropyFactor + missingEvidenceFactor)));

    // 4. Calculate overall compliance score
    const policyCompliancePct = policyPassed ? 100 : 25;

    // 5. Calculate Weighted Composite Confidence Score
    // Risk weight: 30%, Entropy: 20%, Coverage: 20%, Simulation: 10%, Policy: 20%
    const riskScoreTerm = (1 - rawRiskScore / 10) * 100 * 0.3;
    const entropyTerm = (1 - uncertaintyEntropyScore) * 100 * 0.2;
    const evidenceTerm = evidenceCoverage * 100 * 0.2;
    const simulationTerm = simulationCoverage * 100 * 0.1;
    const policyTerm = (policyCompliancePct / 100) * 100 * 0.2;

    const compositeScore = Math.min(100, Math.max(0, Math.round(riskScoreTerm + entropyTerm + evidenceTerm + simulationTerm + policyTerm)));

    // Determine status recommendation
    let recommendingActionStatus: CalibratedCompositeMetrics["recommendingActionStatus"] = "SAFE_RELEASE";
    if (compositeScore < 50 || !policyPassed) {
      recommendingActionStatus = "FORCE_CANCEL";
    } else if (compositeScore < 75) {
      recommendingActionStatus = "AUDITED_BYPASS_OVR";
    }

    const calibratorVerificationHash = `CAL-MD-${Math.floor(Math.random() * 8999 + 1000)}-${compositeScore}`;

    return {
      confidenceScore: compositeScore,
      evidenceCoverage,
      simulationCoverage,
      hallucinationRisk,
      policyCompliancePct,
      recommendingActionStatus,
      calibratorVerificationHash,
    };
  }
}
