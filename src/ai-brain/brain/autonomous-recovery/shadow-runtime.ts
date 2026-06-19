/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";

export interface ShadowTransactionResult {
  transactionId: string;
  sku: string;
  actionTaken: string;
  previousPrice: number;
  proposedPrice: number;
  previousStock: number;
  expectedStock: number;
  simulatedProfitDeltaEuro: number;
  isPassedSandboxAudit: boolean;
  rejectionReason?: string;
  executionEnvironment: "SHADOW" | "LIVE";
  rolledBack: boolean;
}

/**
 * Sandboxed dry-run environment and compensation ledger for secure online execution.
 */
export class ShadowRuntimeSandbox {
  private transactionHistory: ShadowTransactionResult[] = [];

  /**
   * Evaluates a pricing or inventory command inside an offline virtual transaction.
   * If any financial baseline rule is threatened, the transaction is marked for rollback.
   */
  public stageShadowExecution(
    product: Product,
    action: { type: "PRICE_ADJUST" | "INVENTORY_RESTOCK"; value: number }
  ): ShadowTransactionResult {
    const txId = `shd-tx-${Date.now()}-${Math.floor(Math.random() * 8999 + 1000)}`;
    const previousPrice = product.currentPrice;
    const previousStock = product.inventoryLevel;

    let proposedPrice = previousPrice;
    let expectedStock = previousStock;
    let simulatedProfitDeltaEuro = 0;
    let isPassedSandboxAudit = true;
    let rejectionReason = "";

    if (action.type === "PRICE_ADJUST") {
      proposedPrice = action.value;
      const margin = (proposedPrice - product.costPrice) / proposedPrice;

      // Minimum margin compliance check (35% standard floor)
      if (margin < 0.35) {
        isPassedSandboxAudit = false;
        rejectionReason = `Proposed price of €${proposedPrice.toFixed(2)} forces operating margin to ${(margin * 100).toFixed(1)}%, which violates the 35% premium floor.`;
      } else {
        // High price ceiling boundary to avoid prompt injection loops
        if (proposedPrice > previousPrice * 2.5) {
          isPassedSandboxAudit = false;
          rejectionReason = "Safe boundary exceeded: proposed retail jump is greater than 250%.";
        }
      }

      // Simulate 30-day profit delta
      const units30d = product.salesVelocity30d;
      const oldProfit = (previousPrice - product.costPrice) * units30d;
      const proposedProfit = (proposedPrice - product.costPrice) * units30d * (proposedPrice > previousPrice ? 0.88 : 1.15);
      simulatedProfitDeltaEuro = parseFloat((proposedProfit - oldProfit).toFixed(2));

    } else if (action.type === "INVENTORY_RESTOCK") {
      const orderCount = action.value;
      expectedStock = previousStock + orderCount;
      
      const totalCost = orderCount * product.costPrice;
      // Budget cap constraint of €5,000 for autonomous restocks
      if (totalCost > 5000) {
        isPassedSandboxAudit = false;
        rejectionReason = `Autonomous restocking cost (€${totalCost.toFixed(2)}) exceeds maximum shadow approval cap of €5,000.`;
      }
      
      simulatedProfitDeltaEuro = parseFloat((orderCount * (product.currentPrice - product.costPrice) * 0.9).toFixed(2));
    }

    const txResult: ShadowTransactionResult = {
      transactionId: txId,
      sku: product.sku,
      actionTaken: action.type,
      previousPrice,
      proposedPrice,
      previousStock,
      expectedStock,
      simulatedProfitDeltaEuro,
      isPassedSandboxAudit,
      rejectionReason: rejectionReason || undefined,
      executionEnvironment: "SHADOW",
      rolledBack: false
    };

    this.transactionHistory.push(txResult);
    return txResult;
  }

  /**
   * Compensates and rolls back a transaction immediately, restoring states.
   */
  public triggerCompensationRollback(transactionId: string): ShadowTransactionResult | null {
    const tx = this.transactionHistory.find(t => t.transactionId === transactionId);
    if (!tx) return null;

    tx.rolledBack = true;
    tx.executionEnvironment = "SHADOW";
    
    console.log(`[ShadowRuntimeRollback] compensation trigger executed for ${transactionId}. Restore initial states.`);
    return tx;
  }

  public getHistory(): ShadowTransactionResult[] {
    return this.transactionHistory;
  }
}
