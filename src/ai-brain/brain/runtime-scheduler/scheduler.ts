/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScheduledTaskNode, ResourceAllocationSummary } from "./types";
import { TaskStep } from "../../../types";

export class AgentRuntimeScheduler {
  private queue: ScheduledTaskNode[] = [];
  private concurrencyLimit: number = 4;
  private activeCount: number = 0;

  /**
   * Enqueues tasks and structures execution priorities.
   */
  public enqueueSteps(steps: TaskStep[]): ScheduledTaskNode[] {
    this.queue = steps.map((s, idx) => {
      // Determine priority heuristically based on step action
      const priority = s.actionType === "restock" ? 3 : s.actionType === "price" ? 2 : 1;
      return {
        step: s,
        priority,
        maxTimeoutMs: priority === 3 ? 12000 : 8000,
        assignedRuntimeResourceId: `thread-executor-ch-${100 + idx}`,
        isPreempted: false,
        cancelTokenSource: false,
      };
    });

    // Sort queue by priority desc, then step sequence order
    this.queue.sort((a, b) => b.priority - a.priority);
    return this.queue;
  }

  /**
   * Evaluates if low-priority steps are holding thread resources needed by hot critical processes.
   */
  public preemptLowerPriorityTasks(targetCriticalPriority: number): string[] {
    const preemptedThreadIds: string[] = [];
    this.queue.forEach((node) => {
      if (node.priority < targetCriticalPriority && !node.isPreempted) {
        node.isPreempted = true;
        preemptedThreadIds.push(node.assignedRuntimeResourceId);
      }
    });
    return preemptedThreadIds;
  }

  /**
   * Allocates active execution thread limits and tracks backlog footprints.
   */
  public allocateExecutionResources(): ResourceAllocationSummary {
    this.activeCount = Math.min(this.concurrencyLimit, this.queue.length);
    const activeAlerts: string[] = [];

    if (this.queue.some((node) => node.priority === 3)) {
      activeAlerts.push("CRITICAL_PROCUREMENT_ALERT: Thread scheduler active capacity preempted for stockout prevention.");
    }

    return {
      activeConcurrentThreadsCount: this.activeCount,
      totalExecutionBacklogSize: Math.max(0, this.queue.length - this.activeCount),
      resourceQuotasAllocated: {
        tokenCeiling: 180000,
        memoryLeaseQuotaMb: 512,
      },
      systemActiveAlerts: activeAlerts,
    };
  }

  /**
   * Safe execution wrapper providing cancellation or timeout checks.
   */
  public async executeSchedulerGraceSpan<T>(
    node: ScheduledTaskNode,
    executionPromise: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    if (node.isPreempted || node.cancelTokenSource) {
      return { success: false, error: "TASK_PREEMPTED_OR_CANCELLED" };
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ success: false, error: `EXECUTION_TIMEOUT_EXCEEDED: Exceeded max runtime allocation of ${node.maxTimeoutMs}ms` });
      }, node.maxTimeoutMs);

      executionPromise()
        .then((result) => {
          clearTimeout(timeout);
          resolve({ success: true, data: result });
        })
        .catch((err) => {
          clearTimeout(timeout);
          resolve({ success: false, error: err?.message || "RUNTIME_THREAD_CRASHED" });
        });
    });
  }
}
