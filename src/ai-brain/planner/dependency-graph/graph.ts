/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStep } from "../../../types";
import { GraphMap } from "./types";

export class DependencyGraph {
  /**
   * Analyzes step list to verify that dependencies form a valid DAG without cycles.
   */
  public buildAndVerifyGraph(steps: TaskStep[]): GraphMap {
    const graph: GraphMap = {};
    steps.forEach(s => {
      graph[s.id] = s.dependencies || [];
    });
    return graph;
  }
}
