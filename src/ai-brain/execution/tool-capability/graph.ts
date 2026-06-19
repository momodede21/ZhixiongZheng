/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolCapabilityRecord, CapabilityAnalysisReport } from "./types";

export class ToolCapabilityGraph {
  private capMap: Map<string, ToolCapabilityRecord> = new Map();

  constructor() {
    this.hydrateBaselineCapabilities();
  }

  /**
   * Evaluates and retrieves which tools present optimal success probabilities for task execution requirements.
   */
  public analyzeExecutingBoundary(toolName: string): CapabilityAnalysisReport {
    const defaultRecord: ToolCapabilityRecord = {
      toolName,
      historicalSuccessRate: 0.94,
      averageDurationMs: 120,
      perExecutionTokenCost: 1500,
      failureCount: 0,
      lastExecutionTimestamp: new Date().toISOString(),
      optimalStrategicContext: "DTC price synchronizer",
    };

    const record = this.capMap.get(toolName.toUpperCase()) || defaultRecord;
    const bypassMitigationsPlanned: string[] = [];

    if (record.historicalSuccessRate < 0.90) {
      bypassMitigationsPlanned.push(`FALLBACK_ROUTING: High historical failure count. Run double integrity checks.`);
    }
    if (record.averageDurationMs > 500) {
      bypassMitigationsPlanned.push(`TIMEOUT_SENSITIVE_PREEMPTION: Extend scheduler thread timeout windows.`);
    }

    return {
      selectedOptimalTool: record.toolName,
      reliabilityConfidenceScore: Math.round(record.historicalSuccessRate * 100),
      estimatedCostTokens: record.perExecutionTokenCost,
      bypassMitigationsPlanned,
    };
  }

  /**
   * Dynamically upgrades success index records upon positive execution results.
   */
  public logExecutionSuccess(toolName: string, durationMs: number): void {
    const key = toolName.toUpperCase();
    const ex = this.capMap.get(key);
    if (ex) {
      ex.historicalSuccessRate = Math.min(1.0, parseFloat(((ex.historicalSuccessRate * 9 + 1) / 10).toFixed(4)));
      ex.averageDurationMs = Math.round((ex.averageDurationMs * 3 + durationMs) / 4);
      ex.lastExecutionTimestamp = new Date().toISOString();
    }
  }

  /**
   * Logs execution failures, decreasing the tool's rating to trigger failover routing automatically.
   */
  public logExecutionFailure(toolName: string): void {
    const key = toolName.toUpperCase();
    const ex = this.capMap.get(key);
    if (ex) {
      ex.failureCount++;
      ex.historicalSuccessRate = Math.max(0.2, parseFloat(((ex.historicalSuccessRate * 4) / 5).toFixed(4)));
      ex.lastExecutionTimestamp = new Date().toISOString();
    }
  }

  private hydrateBaselineCapabilities(): void {
    this.capMap.set("SHOPIFY_PRICE_DISPATCH", {
      toolName: "SHOPIFY_PRICE_DISPATCH",
      historicalSuccessRate: 0.98,
      averageDurationMs: 180,
      perExecutionTokenCost: 1200,
      failureCount: 0,
      lastExecutionTimestamp: new Date().toISOString(),
      optimalStrategicContext: "Near real-time customer price markdown syncing",
    });

    this.capMap.set("ERP_INVENTORY_RESTOCK", {
      toolName: "ERP_INVENTORY_RESTOCK",
      historicalSuccessRate: 0.95,
      averageDurationMs: 750, // bulk API
      perExecutionTokenCost: 3500,
      failureCount: 0,
      lastExecutionTimestamp: new Date().toISOString(),
      optimalStrategicContext: "Logistics supplier restocking triggers",
    });
  }
}
