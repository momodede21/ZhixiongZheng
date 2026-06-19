/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EvidenceNode {
  sourceType: "DATABASE" | "RAG_DOC" | "MARKET_INDEX" | "HISTORICAL_EXPERIENCE" | "DIGITAL_TWIN";
  sourceName: string;
  reliabilityConfidencePct: number;
  extractedStatement: string;
}

export interface ProvenanceRecord {
  recordId: string;
  stepId: string;
  referencedKnowledgeIds: string[];
  referencedEpisodicMemoryIds: string[];
  referencedRiskEngineMetrics: {
    riskScore: number;
    mitigationApplied: boolean;
  };
  policyCompliant: boolean;
  operatorApprovalSignature: string; // "CEO" | "CFO" etc.
  timestamp: string;
  evidenceGraphNodes?: EvidenceNode[]; // Connecting conclusions directly to rich sources of proof
}
