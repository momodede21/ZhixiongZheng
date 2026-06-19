/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CalibratedCompositeMetrics {
  confidenceScore: number;       // 0 to 100 overall trusted matrix
  evidenceCoverage: number;      // 0.0 to 1.0 (How solid is RAG & graph proof)
  simulationCoverage: number;    // 0.0 to 1.0 (Have we run comprehensive Monte-carlo/AB tests)
  hallucinationRisk: number;     // 0 to 100 reverse confidence bounds
  policyCompliancePct: number;   // 0 to 100 compliance weights
  recommendingActionStatus: "SAFE_RELEASE" | "AUDITED_BYPASS_OVR" | "FORCE_CANCEL";
  calibratorVerificationHash: string;
}
