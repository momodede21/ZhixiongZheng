/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SemanticMemoryItem } from "../../../types";
import { EpisodicMemoryStore } from "../episodic/store";

export class SemanticMemoryRAG {
  private semanticStore: SemanticMemoryItem[] = [];

  constructor() {
    this.semanticStore = [
      {
        id: "sem-1",
        text: "Pricing rule floor must maintain a 15% unit gross profit margin context to prevent total margin leakages.",
        metadata: { category: "financial-policy" },
        timestamp: new Date().toISOString()
      },
      {
        id: "sem-2",
        text: "Overstocked accessories should be bundled with core parent products during campaign clearance cycles.",
        metadata: { category: "retail-strategy" },
        timestamp: new Date().toISOString()
      }
    ];
  }

  public retrieveRAGContext(query: string, episodicStore: EpisodicMemoryStore): string[] {
    const matchedSemantics = this.semanticStore
      .filter(item => item.text.toLowerCase().includes(query.toLowerCase()))
      .map(item => `[Knowledge] ${item.text}`);

    const matchedEpisodes = episodicStore.searchExperiences(query)
      .slice(0, 3)
      .map(item => `[Historic ${item.outcomeType.toUpperCase()}] Action: ${item.actionTaken}. Lesson: ${item.lessonLearned}`);

    const results = [...matchedSemantics, ...matchedEpisodes];
    if (results.length === 0) {
      return ["No specific semantic history retrieved for current query."];
    }
    return results;
  }
}
