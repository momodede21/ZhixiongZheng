/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemTick {
  tickId: string;
  timestamp: string;
  cycleCount: number;
}

export interface CognitiveState {
  currentCycle: number;
  lastTickTime: string;
  isRunning: boolean;
  activeObjective?: string;
}
