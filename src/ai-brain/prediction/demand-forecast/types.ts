/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimesFMForecastOutput } from "./timesfm-adapter";

export interface DemandVelocityProjection {
  sku: string;
  expectedUnitsNext30Days: number;
  seasonalityMultiplier: number;
  predictionConfidenceScore: number; // 0.0 to 100.0
  timesFMForecast?: TimesFMForecastOutput;
}

