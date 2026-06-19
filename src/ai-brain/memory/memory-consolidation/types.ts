/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConsolidationReport {
  timestamp: string;
  bytesPrunedCount: number;
  duplicateThematicCountPR: number;
  utilityRatingRetainedHighPct: number;
  consolidatedIndicesCount: number;
  retainedCoreSalientTheorems: string[];
}
