/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegisteredTool, ToolResolution } from "./types";

export class ToolHubService {
  private tools: Map<string, RegisteredTool> = new Map();

  constructor() {
    this.registerCoreTools();
  }

  private registerCoreTools(): void {
    this.tools.set("ERP_INVENTORY_RESTOCK", {
      name: "ERP_INVENTORY_RESTOCK",
      description: "Secure ERP Procurement portal to inject product units.",
      category: "DATABASE",
      parametersSchema: {
        sku: { type: "string", required: true },
        reorderQty: { type: "number", required: true },
      },
      version: "v4.2.1-lts",
      status: "ONLINE",
    });

    this.tools.set("SHOPIFY_PRICE_DISPATCH", {
      name: "SHOPIFY_PRICE_DISPATCH",
      description: "Direct transactional price updater to storefront listings.",
      category: "DATABASE",
      parametersSchema: {
        sku: { type: "string", required: true },
        retailPrice: { type: "number", required: true },
      },
      version: "v3.0.0-cloud",
      status: "ONLINE",
    });

    this.tools.set("ADS_CAMPAIGN_SPEND_INJECTOR", {
      name: "ADS_CAMPAIGN_SPEND_INJECTOR",
      description: "Adjusts spend allocations in active Google/Meta Ads campaigns.",
      category: "MARKETING",
      parametersSchema: {
        categoryGroup: { type: "string", required: true },
        budgetBoost: { type: "number", required: true },
      },
      version: "v1.1.2",
      status: "ONLINE",
    });
  }

  public getTool(name: string): RegisteredTool | undefined {
    return this.tools.get(name);
  }

  public getOnlineTools(): RegisteredTool[] {
    return Array.from(this.tools.values()).filter((t) => t.status === "ONLINE");
  }

  /**
   * Safe execution handler simulating full secure transactions.
   */
  public async executeTool(toolName: string, args: Record<string, any>): Promise<ToolResolution> {
    const startTime = Date.now();
    const tool = this.tools.get(toolName);

    if (!tool) {
      return {
        success: false,
        toolName,
        dispatchedTimestamp: new Date().toISOString(),
        executionDurationMs: Date.now() - startTime,
        outputPayload: { error: `Requested tool '${toolName}' not present in hub directory.` },
        auditHash: "err_hash_unresolved",
      };
    }

    if (tool.status !== "ONLINE") {
      return {
        success: false,
        toolName,
        dispatchedTimestamp: new Date().toISOString(),
        executionDurationMs: Date.now() - startTime,
        outputPayload: { error: `Tool '${toolName}' is currently offline/degraded.` },
        auditHash: "err_hash_offline",
      };
    }

    // Basic type validation mockup
    for (const [key, rules] of Object.entries(tool.parametersSchema)) {
      if (rules.required && args[key] === undefined) {
        return {
          success: false,
          toolName,
          dispatchedTimestamp: new Date().toISOString(),
          executionDurationMs: Date.now() - startTime,
          outputPayload: { error: `Missing required parameter '${key}' for tool '${toolName}'.` },
          auditHash: `err_val_${key}`,
        };
      }
    }

    // Success response
    const executionDurationMs = Math.round(Math.random() * 80 + 15);
    const auditHash = `TX_${toolName.substring(0, 4)}_${Math.floor(Math.random() * 89999 + 10000)}`;

    return {
      success: true,
      toolName,
      dispatchedTimestamp: new Date().toISOString(),
      executionDurationMs,
      outputPayload: {
        status: "COMMITTED",
        appliedArguments: args,
        systemAck: "ACK_RECEIVED",
        gatewayGatewayId: `gwt-tx-${Math.round(Math.random() * 100000)}`,
      },
      auditHash,
    };
  }
}
