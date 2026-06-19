/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";
import { MasterSchedule } from "./types";

export class PlanGenerator {
  /**
   * Compiles, structures, and schedules multi-step execution plans from raw step decompositions.
   * Maps critical paths and dependency timelines.
   */
  public compilePlanSchedule(
    goalId: string,
    steps: TaskStep[]
  ): MasterSchedule {
    // Generate critical path simply from sequence of dependency lengths
    // Since we've built a DAG, let's identify paths
    const criticalPathSteps = steps
      .sort((a, b) => (a.dependencies?.length || 0) - (b.dependencies?.length || 0))
      .map(s => s.id);

    return {
      planId: `plan-${goalId}-${Date.now()}`,
      compiledSteps: steps,
      criticalPathSteps,
      estimatedTotalCycles: steps.length,
      safetyMarginBufferPct: 15.0 // percent safety buffer margin allocated
    };
  }
}
