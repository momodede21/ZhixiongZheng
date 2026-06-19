/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SystemTick } from "./types";

export class CognitiveScheduler {
  private cycleCount: number = 0;

  public generateNextTick(): SystemTick {
    this.cycleCount++;
    return {
      tickId: `tick-${Date.now()}-${this.cycleCount}`,
      timestamp: new Date().toISOString(),
      cycleCount: this.cycleCount,
    };
  }

  public getCycleCount(): number {
    return this.cycleCount;
  }
}
