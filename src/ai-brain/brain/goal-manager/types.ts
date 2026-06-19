/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GoalMetronome {
  subgoalId: string;
  name: string;
  metricType: "MARGIN" | "INVENTORY_DAYS" | "VOLUME_LIMIT" | "MARKETING_ROI";
  targetValue: number;
  currentValue: number;
  weightPct: number;
}

export interface ContinuousStrategicGoal {
  id: string;
  objectiveText: string;
  targetKpiValue: number;
  currentKpiValue: number;
  accomplishmentPct: number;
  metricLabel: string;
  subgoals: GoalMetronome[];
  status: "FAILSAFE_TRACKING" | "CRITICAL_ATTENTION" | "TARGETS_ACHIEVED";
}
