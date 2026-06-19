/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RouterExecutionResult {
  routedTool: string;
  parametersApplied: Record<string, any>;
  transactionSecured: boolean;
  timestamp: string;
}
