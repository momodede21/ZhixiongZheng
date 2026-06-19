/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { CognitiveStageType, CognitiveStateTransition, CognitiveRegistrySnapshot } from "./types";

export class CognitiveStateMachine {
  private currentStage: CognitiveStageType = "IDLE";
  private totalTransitedCycles: number = 0;
  private history: CognitiveStateTransition[] = [];
  private energyLevel: number = 100;

  /**
   * Safe stage transformation wrapper.
   */
  public transitTo(nextStage: CognitiveStageType, reason: string): CognitiveStateTransition {
    const previous = this.currentStage;
    
    // Dissipate energy based on stage resource intensity
    const dissipation = this.getDissipationCost(nextStage);
    this.energyLevel = Math.max(0, this.energyLevel - dissipation);

    // If sleeping, restore energy
    if (nextStage === "SLEEP") {
      this.energyLevel = 100;
    }

    this.currentStage = nextStage;
    this.totalTransitedCycles++;

    const transitionRecord: CognitiveStateTransition = {
      timestamp: new Date().toISOString(),
      fromStage: previous,
      toStage: nextStage,
      triggerEvent: reason,
      energyLevelRemainder: this.energyLevel,
    };

    this.history.push(transitionRecord);
    return transitionRecord;
  }

  public getSnapshot(): CognitiveRegistrySnapshot {
    return {
      currentStage: this.currentStage,
      totalTransitedCycles: this.totalTransitedCycles,
      unresolvedActionBlocker: this.energyLevel < 15,
      historyLogs: [...this.history],
    };
  }

  private getDissipationCost(stage: CognitiveStageType): number {
    switch (stage) {
      case "DEBATE":
      case "SIMULATE":
        return 15;
      case "PLAN":
      case "EXECUTE":
        return 12;
      case "HYPOTHESIZE":
        return 8;
      case "OBSERVE":
      case "FOCUS":
      case "REFLECT":
      case "LEARN":
        return 5;
      default:
        return 0;
    }
  }
}
