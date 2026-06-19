/**
 * SPDX-License-Identifier: Apache-2.0
 */

export type CrawlerEngineType = "CRAWL4AI" | "FIRECRAWL" | "JINA_READER";

export interface CrawlResponsePayload {
  engine: CrawlerEngineType;
  rawUrl: string;
  sourceDomain: string;
  httpStatus: number;
  timeElapsedMs: number;
  rawHtmlSize: number;
  extractedTitle: string;
  rawHtmlContent: string;
}

export interface PurifiedMarkdownPayload {
  title: string;
  markdownText: string;
  cleansedCharactersCount: number;
  scrapingEntropyScore: number; // 0.0 to 1.0 noise level
}

export interface IngestionChunkNode {
  chunkIndex: number;
  parentUrl: string;
  chunkText: string;
  tokenCount: number;
  simulatedEmbedding: number[]; // 1536 dimension mockup vectors
}

export interface EntityRelationNode {
  subject: string;
  predicate: string;
  object: string;
  confidenceScore: number;
}

export interface UnifiedIngestionReceipt {
  ingestedUrl: string;
  appliedEngine: CrawlerEngineType;
  bytesCrawled: number;
  retrievedMarkdown: string;
  chunks: IngestionChunkNode[];
  associatedEntities: EntityRelationNode[];
}
