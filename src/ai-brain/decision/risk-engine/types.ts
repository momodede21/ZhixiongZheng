/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RiskAnalysis {
  riskScore: number; // 1 to 10
  riskDescription: string;
  mitigationHeuristic: string;
}
