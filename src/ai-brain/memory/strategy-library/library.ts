/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrategyStencil } from "./types";

export class StrategyLibraryService {
  private strategies: StrategyStencil[] = [];

  constructor() {
    this.seedStrategies();
  }

  private seedStrategies(): void {
    this.strategies.push({
      strategyId: "STRAT_BUNDLE_PREMIUM",
      name: "Accretive Multi-Item Premium Bundling",
      description: "Bundles a high-margin premium accessory, lifting net revenue and clearing slow accessory stock.",
      contextSeasonality: "YEAR_ROUND",
      fitCategoryKeywords: ["accessory", "drinkware", "lamp", "glow"],
      historicalRoiMultiplier: 4.1,
      failureRiskPct: 15,
      recommendedTacticalProverbs: [
        "Include a decorative high-perceived-value gift card wrapper",
        "Set direct pricing bundle discount threshold exactly at 18% below standalone prices",
      ],
    });

    this.strategies.push({
      strategyId: "STRAT_Markdown_VELOCITY",
      name: "High-Velocity Elastic Markdown Cleansing",
      description: "Aggressive, timed retail price reduction designed to rapidly liquidate high volumes of inventory.",
      contextSeasonality: "SUMMER",
      fitCategoryKeywords: ["flask", "bottle", "drinkware"],
      historicalRoiMultiplier: 3.2,
      failureRiskPct: 22,
      recommendedTacticalProverbs: [
        "Create high-urgency inventory scarcity indicators",
        "Maintain deep digital twin pricing simulations prior to executing live markdown loops",
      ],
    });

    this.strategies.push({
      strategyId: "STRAT_BUDGET_REALLOCATION",
      name: "Elastic ROI Marketing Budget Spillover",
      description: "Reallocates marketing budgets directly to hyper-performing digital product groups.",
      contextSeasonality: "WINTER",
      fitCategoryKeywords: ["earbuds", "wireless", "gadgets"],
      historicalRoiMultiplier: 4.8,
      failureRiskPct: 10,
      recommendedTacticalProverbs: [
        "Thoroughly analyze competitor ad impressions",
        "Instantly pause ad sets dropping below 1.8x immediate short-term ROI baseline ratios",
      ],
    });
  }

  public getAllStrategies(): StrategyStencil[] {
    return this.strategies;
  }

  /**
   * Filters and retrieves strategies aligned with categories and seasonal context.
   */
  public queryMatchedStrategies(category: string, season: string): StrategyStencil[] {
    const formattedCategory = category.toLowerCase();
    const formattedSeason = season.toUpperCase();

    return this.strategies.filter((strat) => {
      const matchSeason = strat.contextSeasonality === "YEAR_ROUND" || strat.contextSeasonality === formattedSeason;
      const matchKeywords = strat.fitCategoryKeywords.some((kw) => formattedCategory.includes(kw));
      return matchSeason || matchKeywords;
    });
  }
}
