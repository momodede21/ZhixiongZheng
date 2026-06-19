/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContentFingerprintMetadata {
  sha256Checksum: string;
  canonicalUrl: string;
  sourceTrustScore: number; // 0.0 to 1.0 trust matrix
  language: string;
  extractedEntities: string[];
  lastIndexedAt: string;
  citationMarkerKey: string; // e.g. [CIT-REPORTS-2026]
}

export interface KnowledgeDocument {
  id: string;
  sourceUrl: string;
  category: string;
  extractedTitle: string;
  markdownContent: string;
  chunksCount: number;
  fingerprint?: ContentFingerprintMetadata;
}

export interface RetrievalMatch {
  documentId: string;
  relevanceScore: number; // 0.0 to 1.0 composite
  snippet: string;
  keywordMatchScore?: number;
  vectorSimilarityScore?: number;
  sourceCitationRef?: string; // Citation marker URL/Anchor
}
