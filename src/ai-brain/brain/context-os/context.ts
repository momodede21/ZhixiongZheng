/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";
import { ContextOSSnapshot, PromptPayload } from "./types";

export class ContextOSService {
  private activeObjective: string = "";
  private safetyWarnings: string[] = [];

  public updateActiveObjective(objective: string): void {
    this.activeObjective = objective;
  }

  public registerSafetyWarning(warning: string): void {
    this.safetyWarnings.push(warning);
  }

  public clearSafetyWarnings(): void {
    this.safetyWarnings = [];
  }

  /**
   * Synthesizes and captures real-time enterprise metrics for deep prompt optimization.
   */
  public generateUnifiedContext(
    products: Product[],
    capital: number,
    memoryCount: number
  ): ContextOSSnapshot {
    const criticalStockSKUs = products
      .filter((p) => p.inventoryLevel < 20)
      .map((p) => p.sku);

    if (criticalStockSKUs.length > 0) {
      if (!this.safetyWarnings.includes("STOCK_OUT_CRITICAL_WARNING")) {
        this.safetyWarnings.push(`Stock warning on products: ${criticalStockSKUs.join(", ")}`);
      }
    }

    return {
      activeObjective: this.activeObjective,
      enterpriseFinancialCap: capital,
      productCount: products.length,
      criticalStockSKUs,
      systemMemoryLogCount: memoryCount,
      unresolvedSafetyWarnings: [...this.safetyWarnings],
    };
  }

  /**
   * Compiles the ultimate system prompt decorated with real-time enterprise variables.
   */
  public compileSystemPrompt(snapshot: ContextOSSnapshot): PromptPayload {
    const compiledSystemPrompt = `
      [AI-COMMERCE-OS BRAIN KERNEL SYSTEM INSTRUCTION]
      ROLE: Chief Autonomic Operational Governor of Commerce Operating System.
      CURRENT OBJECTIVE: "${snapshot.activeObjective}"
      
      ENTERPRISE STATE SYNOPSIS:
      - Capital Bank Assets: ¥${snapshot.enterpriseFinancialCap.toLocaleString()}
      - Catalog Range Size: ${snapshot.productCount} skus
      - Fragile Stock Alert SKUs: [${snapshot.criticalStockSKUs.join(", ") || "NONE"}]
      - Experience Records Logged: ${snapshot.systemMemoryLogCount}
      
      SAFETY / SANCTION POLICIES:
      ${snapshot.unresolvedSafetyWarnings.map((w) => `- WARNING: ${w}`).join("\n") || "- State: COMPLIANT"}
      
      Strive for extreme capital efficiency, absolute safety margins, high velocity, and zero opportunity regrets.
    `;

    return {
      compiledSystemPrompt,
      variableDecorators: {
        activeObjective: snapshot.activeObjective,
        capitalLimit: snapshot.enterpriseFinancialCap.toString(),
        totalProducts: snapshot.productCount.toString(),
      },
    };
  }
}
