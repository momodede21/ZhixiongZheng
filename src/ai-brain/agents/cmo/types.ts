/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRole } from "../../../types";

export interface CMOApprovalPayload {
  role: AgentRole;
  approved: boolean;
  marketShareGainHeuristic: number; // e.g. +4.5%
  rationale: string;
}
