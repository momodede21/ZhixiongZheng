/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExperiencePattern } from "../../../types";

export class EpisodicMemoryStore {
  private experienceStore: ExperiencePattern[] = [];

  constructor() {
    this.seedBaselineExperiences();
  }

  private seedBaselineExperiences() {
    this.experienceStore = [
      {
        id: "exp-baseline-1",
        goalType: "ADJUST_PRICE",
        actionTaken: "20% Discount markdown for Electronics near overstock thresholds",
        outcomeType: "success",
        contextSummary: "Overstock of gadgets with sales velocity below 5 units/week",
        lessonLearned: "Seasonal gadgets respond strongly to a 15-20% discount. Lift in velocity makes up for margin loss.",
        timestamp: "2026-06-15T08:00:00Z"
      },
      {
        id: "exp-baseline-2",
        goalType: "ADJUST_PRICE",
        actionTaken: "Markdown price below absolute unit acquisition cost",
        outcomeType: "failure",
        contextSummary: "Attempted aggressive apparel clearance to zero stock",
        lessonLearned: "Selling below unit cost is blocked by financial safety policy. Do not propose value under costPrice.",
        timestamp: "2026-06-16T12:00:00Z"
      },
      {
        id: "exp-baseline-3",
        goalType: "LAUNCH_CAMPAIGN",
        actionTaken: "Bundle promotions for low rotation kitchen accessories",
        outcomeType: "success",
        contextSummary: "Kitchenware inventory level above 200 items",
        lessonLearned: "Overstock accessories are best cleared via complementary product bundles rather than raw discount price wars.",
        timestamp: "2026-06-17T09:30:00Z"
      }
    ];
  }

  public addExperience(goalType: string, action: string, outcome: 'success' | 'failure', context: string, lesson: string): ExperiencePattern {
    const item: ExperiencePattern = {
      id: "exp-" + Math.floor(Math.random() * 100000),
      goalType,
      actionTaken: action,
      outcomeType: outcome,
      contextSummary: context,
      lessonLearned: lesson,
      timestamp: new Date().toISOString()
    };
    this.experienceStore.push(item);
    return item;
  }

  public getExperiences(): ExperiencePattern[] {
    return this.experienceStore;
  }

  public searchExperiences(query: string): ExperiencePattern[] {
    const q = query.toLowerCase();
    return this.experienceStore.filter(exp => 
      exp.goalType.toLowerCase().includes(q) ||
      exp.actionTaken.toLowerCase().includes(q) ||
      exp.lessonLearned.toLowerCase().includes(q) ||
      exp.contextSummary.toLowerCase().includes(q)
    );
  }
}
