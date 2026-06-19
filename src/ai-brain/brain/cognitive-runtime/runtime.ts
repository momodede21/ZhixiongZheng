/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CognitiveScheduler } from "./scheduler";
import { CognitiveState } from "./types";

export class CognitiveRuntime {
  private scheduler: CognitiveScheduler;
  private state: CognitiveState;

  constructor() {
    this.scheduler = new CognitiveScheduler();
    this.state = {
      currentCycle: 0,
      lastTickTime: new Date().toISOString(),
      isRunning: false,
    };
  }

  public startCycle(objective: string) {
    this.state.isRunning = true;
    this.state.activeObjective = objective;
    const tick = this.scheduler.generateNextTick();
    this.state.currentCycle = tick.cycleCount;
    this.state.lastTickTime = tick.timestamp;
    return tick;
  }

  public stopCycle() {
    this.state.isRunning = false;
    this.state.activeObjective = undefined;
  }

  public getRuntimeState(): CognitiveState {
    return this.state;
  }
}
