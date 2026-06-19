/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoutingParameters, ModelRouteDecision } from "./types";

export class ModelRouter {
  /**
   * Evaluates the task requirements and routes it to the optimal model configuration.
   */
  public routeTask(params: RoutingParameters): ModelRouteDecision {
    const { urgency, complexity, securityRequired } = params;

    let selectedModel = "gemini-3.5-flash"; // Default fast model
    let expectedLatencyMs = 600;
    let costCoefficient = 1.0;
    const reasons: string[] = [];

    if (complexity === "NIGHTMARE" || complexity === "ANALYTICAL") {
      selectedModel = "gemini-3.1-pro-preview"; // High intelligence pro model
      expectedLatencyMs = 2500;
      costCoefficient = 15.0;
      reasons.push("Task complexity requires deep semantic lookup, complex math & cross-product dependencies.");
    } else {
      reasons.push("Simple operational target; utilizing low-cost high-throughput flash models.");
    }

    if (urgency === "CRITICAL") {
      expectedLatencyMs = Math.round(expectedLatencyMs * 0.6); // Simulate low thinking level fallback for low latency
      reasons.push("Urgent priority; throttle output limits for maximum reaction speed.");
    }

    if (securityRequired) {
      reasons.push("Action demands structured sandbox safety checks before execution.");
    }

    return {
      selectedModel,
      reasoningChain: reasons.join(" // "),
      expectedLatencyMs,
      costCoefficient,
    };
  }
}
