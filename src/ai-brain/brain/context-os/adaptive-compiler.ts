/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContextOSSnapshot } from "./types";
import { RetrievalMatch } from "../../knowledge/rag/types";

export interface AdaptiveCompilerPayload {
  compiledSystemPrompt: string;
  injectedRagCitationsCount: number;
  policyDSLString: string;
}

export class AdaptivePromptCompiler {
  /**
   * Generates a fully dynamic, context-dense, adaptive prompt optimized for LLM execution context limits.
   */
  public compileAdaptiveSystemPrompt(
    snapshot: ContextOSSnapshot,
    ragHits: RetrievalMatch[],
    kpiAnomalies: string[],
    strategicLessons: string[]
  ): AdaptiveCompilerPayload {
    // 1. Build Citation blocks
    const citationsBlock = ragHits
      .map((h, i) => `[Source ${i + 1}] (${h.sourceCitationRef || "INDEXED_RAG_CORPUS"}): "${h.snippet}"`)
      .join("\n");

    // 2. Build Critical KPI Anomalies and warnings
    const anomaliesBlock = kpiAnomalies.length > 0
      ? kpiAnomalies.map((a) => `[KPI_ANOMALY_ALERT] -> ${a}`).join("\n")
      : "No critical KPI drift triggers detected.";

    // 3. Ingest strategic lessons
    const memoryLessonsBlock = strategicLessons.length > 0
      ? strategicLessons.map((l) => `[LONG_TERM_LESSON] -> ${l}`).join("\n")
      : "No long-term strategic evolution matches located.";

    // 4. Synthesize AI Commerce OS Constitution DSL rules
    const policyDSLString = `
      RULE-1: NEVER adjust product pricing below unit cost margin ceiling (grossMargin >= 0.0).
      RULE-2: REQUIRE CFO signature authentication trigger for logistics ordering bounds over 100 units.
      RULE-3: REJECT price markdown adjustments greater than 20% in seasonal transition windows unless backed by A/B sandbox verification.
    `;

    const compiledSystemPrompt = `
================================================================================
🌍 AI COMMERCE OPERATING SYSTEM - ADAPTIVE BRAIN PROMPT COMPILER
================================================================================
ROLE: Chief Executive Autonomic Agent (Multi-Agent Council Governance Node).
CURRENT OBJECTIVE: "${snapshot.activeObjective || "Maximize bottomline capital efficiency and velocity"}"

--------------------------------------------------------------------------------
📈 LIVE BUSINESS STATE & ACTIVE KPI FLUCTUATIONS:
${anomaliesBlock}

--------------------------------------------------------------------------------
📖 LONG-TERM DISCOVERED LESSONS & TRACING EXPERIENCES:
${memoryLessonsBlock}

--------------------------------------------------------------------------------
🔎 HIGH-RELEVANCE RETRIEVAL-AUGMENTED CONTEXTS (RAG):
${citationsBlock || "No primary RAG documentation found for this task pattern."}

--------------------------------------------------------------------------------
📜 COMPLIANCE CONSTITUTION RULES (POLICY DSL):
${policyDSLString}
================================================================================
Direct execution pathways: Prioritize risk-neutral ROI loops, ensure absolute safety boundaries, and maintain unmitigated trace transparency.
`;

    return {
      compiledSystemPrompt,
      injectedRagCitationsCount: ragHits.length,
      policyDSLString,
    };
  }
}
