/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentRole } from "../../../types";

export interface AgentDecisionPayload {
  role: AgentRole;
  approved: boolean;
  rationale: string;
}
