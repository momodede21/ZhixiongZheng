/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PolicyCheckResult {
  policyCompliant: boolean;
  rejectReason?: string;
  remedyActionSuggested?: string;
}
