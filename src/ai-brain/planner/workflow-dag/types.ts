/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";

export interface TopologicalPlanResult {
  topologicalOrderSteps: TaskStep[];
  graphCyclicStatus: boolean;
  unresolvedParents: string[];
  stagesGrouped: Record<number, TaskStep[]>; // Multi-stage timeline blocks for tiered scheduling
}
