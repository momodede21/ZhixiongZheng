/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MetaRoutingResult {
  focusEngine: "planner" | "reasoner" | "decision" | "reflection";
  tokenBudget: number;
  depthLimit: number;
  rationale: string;
}
