/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ElasticityEvaluation {
  elasticityCoefficient: number; // e.g. -2.5
  estimatedVolumeLiftPct: number; // e.g. 25 (%)
  marginalRevenueProfitDelta: number; // revenue delta
  optimalPricingBoundMin: number;
  optimalPricingBoundMax: number;
}
