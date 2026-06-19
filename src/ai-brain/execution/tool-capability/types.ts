/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ToolCapabilityRecord {
  toolName: string;
  historicalSuccessRate: number; // 0.0 to 1.0 representing reliability
  averageDurationMs: number;
  perExecutionTokenCost: number;
  failureCount: number;
  lastExecutionTimestamp: string;
  optimalStrategicContext: string; // descriptive use case
}

export interface CapabilityAnalysisReport {
  selectedOptimalTool: string;
  reliabilityConfidenceScore: number;
  estimatedCostTokens: number;
  bypassMitigationsPlanned: string[];
}
