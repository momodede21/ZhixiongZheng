/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { UnifiedSkill } from "./types";

export class SkillLibraryService {
  private skills: Map<string, UnifiedSkill> = new Map();

  constructor() {
    this.seedDefaultSkills();
  }

  private seedDefaultSkills(): void {
    this.skills.set("SK_DYN_PRICING", {
      id: "SK_DYN_PRICING",
      name: "Dynamic Elasticity Pricing Adjustment",
      description: "Applies price updates based on elasticity, cost pricing, and competitor avg margins.",
      domainFocus: "pricing",
      preflightChecks: ["Verify cost baseline is below suggested target", "Fetch competitor listed averages"],
      workflowSequence: [
        "Read price elasticity indicators",
        "Compare with safety price boundaries",
        "Commit final price update",
      ],
    });

    this.skills.set("SK_RESTOCK_THRESHOLD", {
      id: "SK_RESTOCK_THRESHOLD",
      name: "Buffer Restock Safeguard Routine",
      description: "Safeguards inventory against total stockout critical failures by auto-procuring replacement stock.",
      domainFocus: "inventory",
      preflightChecks: ["Confirm product is low-stock state", "Verify corporate procurement budget room"],
      workflowSequence: [
        "Calculate risk multiplier score",
        "Acquire supply-chain procurement allocation",
        "Discharge restock trigger",
      ],
    });

    this.skills.set("SK_BUNDLE_CAMPAIGN", {
      id: "SK_BUNDLE_CAMPAIGN",
      name: "Tactical Accretive Bundle Campaigns",
      description: "Pairs premium products with accessory add-ons to lift net average order value.",
      domainFocus: "marketing",
      preflightChecks: ["Confirm companion SKU has volume room", "Verify marketing ROI indices"],
      workflowSequence: [
        "Synthesize custom product pairing configurations",
        "Submit to CFO & CMO dual consensus",
        "Broadcast active campaign to platform client",
      ],
    });
  }

  public getSkill(id: string): UnifiedSkill | undefined {
    return this.skills.get(id);
  }

  public getAllSkills(): UnifiedSkill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Matches the best available skill based on parsed objective requirements.
   */
  public queryBestFitSkill(actionType: string): UnifiedSkill | null {
    const term = actionType.toLowerCase();
    if (term.includes("price") || term.includes("markdown") || term.includes("elastic")) {
      return this.skills.get("SK_DYN_PRICING") || null;
    }
    if (term.includes("restock") || term.includes("inventory") || term.includes("stock")) {
      return this.skills.get("SK_RESTOCK_THRESHOLD") || null;
    }
    if (term.includes("campaign") || term.includes("promotion") || term.includes("bundle")) {
      return this.skills.get("SK_BUNDLE_CAMPAIGN") || null;
    }
    return null;
  }
}
