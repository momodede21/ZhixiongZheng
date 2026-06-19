/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";
import { TopologicalPlanResult } from "./types";

export class WorkflowDagEngine {
  /**
   * Sorts the tasks topologically to guarantee all prerequisites are met, isolating cyclic errors.
   */
  public compileTopologicalDAG(steps: TaskStep[]): TopologicalPlanResult {
    const adjList: Map<string, string[]> = new Map();
    const inDegree: Map<string, number> = new Map();
    const stepMap: Map<string, TaskStep> = new Map();

    // Hydrate mappings
    steps.forEach((s) => {
      stepMap.set(s.id, s);
      if (!adjList.has(s.id)) adjList.set(s.id, []);
      if (!inDegree.has(s.id)) inDegree.set(s.id, 0);
    });

    const unresolvedParents: string[] = [];

    // Map dependency edges (parents point to children)
    steps.forEach((s) => {
      s.dependencies?.forEach((parentID) => {
        if (!stepMap.has(parentID)) {
          unresolvedParents.push(parentID);
          return;
        }
        const currentAdj = adjList.get(parentID) || [];
        adjList.set(parentID, [...currentAdj, s.id]);
        inDegree.set(s.id, (inDegree.get(s.id) || 0) + 1);
      });
    });

    // Kahn's Algorithm / BFS Topological Sort
    const queue: string[] = [];
    inDegree.forEach((degree, stepId) => {
      if (degree === 0) {
        queue.push(stepId);
      }
    });

    const topologicalOrderSteps: TaskStep[] = [];
    const stagesGrouped: Record<number, TaskStep[]> = {};
    let currentStage = 1;

    while (queue.length > 0) {
      const stageSize = queue.length;
      stagesGrouped[currentStage] = [];

      for (let i = 0; i < stageSize; i++) {
        const currId = queue.shift()!;
        const step = stepMap.get(currId);
        if (step) {
          topologicalOrderSteps.push(step);
          stagesGrouped[currentStage].push(step);
          
          // Decrement in-degree of neighbors
          const neighbors = adjList.get(currId) || [];
          neighbors.forEach((neighId) => {
            const nextDegree = (inDegree.get(neighId) || 1) - 1;
            inDegree.set(neighId, nextDegree);
            if (nextDegree === 0) {
              queue.push(neighId);
            }
          });
        }
      }
      currentStage++;
    }

    const graphCyclicStatus = topologicalOrderSteps.length < steps.length;

    // Fallback: if cyclic, return default sequence
    const finalSteps = graphCyclicStatus ? steps : topologicalOrderSteps;

    return {
      topologicalOrderSteps: finalSteps,
      graphCyclicStatus,
      unresolvedParents,
      stagesGrouped,
    };
  }
}
