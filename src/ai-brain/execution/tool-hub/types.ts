/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegisteredTool {
  name: string;
  description: string;
  category: "DATABASE" | "MARKETING" | "LOGISTICS" | "FINANCE";
  parametersSchema: Record<string, any>;
  version: string;
  status: "ONLINE" | "MAINTENANCE" | "DEGRADED";
}

export interface ToolResolution {
  success: boolean;
  toolName: string;
  dispatchedTimestamp: string;
  executionDurationMs: number;
  outputPayload: any;
  auditHash: string;
}
