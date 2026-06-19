/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkingMemoryItem } from "../../../types";

export class WorkingMemoryManager {
  private memoryItems: WorkingMemoryItem[] = [];

  public clearMemory() {
    this.memoryItems = [];
  }

  public append(agentId: string, content: string) {
    this.memoryItems.push({
      id: "wm-" + Math.floor(Math.random() * 100000),
      agentId,
      content,
      timestamp: new Date().toISOString()
    });
  }

  public getMemories(): WorkingMemoryItem[] {
    return this.memoryItems;
  }
}
