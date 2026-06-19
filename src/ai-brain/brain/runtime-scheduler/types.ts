/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";

export interface ScheduledTaskNode {
  step: TaskStep;
  priority: number; // 1 (LOW) to 3 (CRITICAL)
  maxTimeoutMs: number;
  assignedRuntimeResourceId: string;
  isPreempted: boolean;
  cancelTokenSource?: boolean;
}

export interface ResourceAllocationSummary {
  activeConcurrentThreadsCount: number;
  totalExecutionBacklogSize: number;
  resourceQuotasAllocated: { tokenCeiling: number; memoryLeaseQuotaMb: number };
  systemActiveAlerts: string[];
}
