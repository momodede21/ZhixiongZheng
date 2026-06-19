/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";

export interface ContextOSSnapshot {
  activeObjective: string;
  enterpriseFinancialCap: number;
  productCount: number;
  criticalStockSKUs: string[];
  systemMemoryLogCount: number;
  unresolvedSafetyWarnings: string[];
}

export interface PromptPayload {
  compiledSystemPrompt: string;
  variableDecorators: Record<string, string>;
}
