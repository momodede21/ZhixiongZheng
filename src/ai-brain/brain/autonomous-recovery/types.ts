/**
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemRecoveryMetrics {
  recoveryAttemptId: string;
  triggeredFailureReason: string;
  appliedFailoverModelName: string;
  retrySucceeded: boolean;
  activeCoolDownRemainingMs: number;
  monitoredState: "DEGRADED_FAILOVER" | "NOMINAL_HEALTH" | "ALERT_SHUTDOWN";
}
