/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";

export interface MasterSchedule {
  planId: string;
  compiledSteps: TaskStep[];
  criticalPathSteps: string[]; // sequence of step IDs on critical path
  estimatedTotalCycles: number;
  safetyMarginBufferPct: number;
}
