/**
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModelUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ModelComplexity = "SIMPLE" | "ANALYTICAL" | "CREATIVE" | "NIGHTMARE";

export interface RoutingParameters {
  urgency: ModelUrgency;
  complexity: ModelComplexity;
  securityRequired: boolean;
  tokenBudgetLimit?: number;
}

export interface ModelRouteDecision {
  selectedModel: string;
  reasoningChain: string;
  expectedLatencyMs: number;
  costCoefficient: number;
}
