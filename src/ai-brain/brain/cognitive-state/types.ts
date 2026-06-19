/**
 * SPDX-License-Identifier: Apache-2.0
 */

export type CognitiveStageType =
  | "IDLE"
  | "OBSERVE"
  | "FOCUS"
  | "HYPOTHESIZE"
  | "PLAN"
  | "DEBATE"
  | "SIMULATE"
  | "EXECUTE"
  | "REFLECT"
  | "LEARN"
  | "SLEEP";

export interface CognitiveStateTransition {
  timestamp: string;
  fromStage: CognitiveStageType;
  toStage: CognitiveStageType;
  triggerEvent: string;
  energyLevelRemainder: number; // 0 to 100 representing CPU depletion curves
}

export interface CognitiveRegistrySnapshot {
  currentStage: CognitiveStageType;
  totalTransitedCycles: number;
  unresolvedActionBlocker: boolean;
  historyLogs: CognitiveStateTransition[];
}
