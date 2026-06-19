/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContinuousStrategicGoal, GoalMetronome } from "./types";

export class ContinuousGoalManager {
  private activeGoals: Map<string, ContinuousStrategicGoal> = new Map();

  constructor() {
    this.seedDefaultGoals();
  }

  private seedDefaultGoals(): void {
    this.activeGoals.set("G_ANNUAL_PROFIT_BOOST", {
      id: "G_ANNUAL_PROFIT_BOOST",
      objectiveText: "Maximize Annual Profit Margins and Clear Inefficient Capital Stock Outlets",
      targetKpiValue: 60.0, // target 60% gross profit margins overall
      currentKpiValue: 44.5,
      accomplishmentPct: 74.1,
      metricLabel: "AGGREGATE_MARGIN_RATIO",
      status: "FAILSAFE_TRACKING",
      subgoals: [
        {
          subgoalId: "SUB_MARGIN_RISE",
          name: "Adjust retail prices to maintain >= 25% individual margin",
          metricType: "MARGIN",
          targetValue: 25.0,
          currentValue: 24.2,
          weightPct: 40,
        },
        {
          subgoalId: "SUB_STOCK_DAYS",
          name: "Clear aging inventory and reduce holding days < 30",
          metricType: "INVENTORY_DAYS",
          targetValue: 30.0,
          currentValue: 45.0,
          weightPct: 30,
        },
        {
          subgoalId: "SUB_ROI_ADS",
          name: "Optimize active Meta/Google campaign spends above 3.5 ROI",
          metricType: "MARKETING_ROI",
          targetValue: 3.5,
          currentValue: 2.8,
          weightPct: 30,
        },
      ],
    });
  }

  public getGoal(id: string): ContinuousStrategicGoal | undefined {
    return this.activeGoals.get(id);
  }

  public getAllActiveGoals(): ContinuousStrategicGoal[] {
    return Array.from(this.activeGoals.values());
  }

  /**
   * Tracks and evaluates strategic progress of a policy/sale adjustment against core subgoals.
   */
  public evaluateInfluence(subgoalId: string, measuredImpact: number): ContinuousStrategicGoal[] {
    this.activeGoals.forEach((goal) => {
      goal.subgoals = goal.subgoals.map((sub) => {
        if (sub.subgoalId === subgoalId) {
          const newVal = sub.currentValue + measuredImpact;
          return { ...sub, currentValue: parseFloat(newVal.toFixed(2)) };
        }
        return sub;
      });

      // Recalculate accomplishment metrics
      let aggregateWeightedProgress = 0;
      goal.subgoals.forEach((sub) => {
        let progress = 0;
        if (sub.metricType === "INVENTORY_DAYS") {
          // For inventory days, lower is better
          progress = sub.currentValue <= sub.targetValue ? 100 : (sub.targetValue / sub.currentValue) * 100;
        } else {
          progress = (sub.currentValue / sub.targetValue) * 100;
        }
        aggregateWeightedProgress += Math.min(100, Math.max(0, progress)) * (sub.weightPct / 100);
      });

      goal.accomplishmentPct = parseFloat(aggregateWeightedProgress.toFixed(1));
      goal.currentKpiValue = parseFloat((goal.targetKpiValue * (goal.accomplishmentPct / 100)).toFixed(2));

      if (goal.accomplishmentPct >= 95) {
        goal.status = "TARGETS_ACHIEVED";
      } else if (goal.accomplishmentPct < 70) {
        goal.status = "CRITICAL_ATTENTION";
      } else {
        goal.status = "FAILSAFE_TRACKING";
      }
    });

    return this.getAllActiveGoals();
  }
}
