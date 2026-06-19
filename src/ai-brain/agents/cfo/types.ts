/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRole } from "../../../types";

export interface CFOApprovalPayload {
  role: AgentRole;
  approved: boolean;
  estimatedROI: number;
  capitalCommitted: number;
  rationale: string;
}
