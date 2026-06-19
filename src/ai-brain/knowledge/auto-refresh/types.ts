/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CrawlTaskNode {
  targetDomain: string;
  bytesHarvested: number;
  cleansedMarkdownCharCount: number;
  status: "FINISHED" | "RUNNING" | "DEGRADED";
}

export interface RefreshLogRegistry {
  lastAutomaticRefreshTimestamp: string;
  totalSyncedKnowledgeDocsCount: number;
  qualityReviewScore: number; // 0 to 100
  harvestedNodes: CrawlTaskNode[];
}
