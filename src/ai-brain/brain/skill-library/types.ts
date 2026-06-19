/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UnifiedSkill {
  id: string;
  name: string;
  description: string;
  domainFocus: "pricing" | "inventory" | "marketing" | "procurement";
  preflightChecks: string[];
  workflowSequence: string[];
}
