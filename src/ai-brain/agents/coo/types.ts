/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRole } from "../../../types";

export interface COOApprovalPayload {
  role: AgentRole;
  approved: boolean;
  stockoutMitigationConfidence: number; // e.g. 95 (%)
  rationale: string;
}
