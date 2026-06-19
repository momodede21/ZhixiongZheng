export interface BrandDNA {
  anchorCategory: string;
  minimumGrossMargin: number;
  brandTier: "entry" | "mid" | "premium" | "luxury";
  coreMarkets: string[];
  longTermGoal12MonthGMV: string;
}

/**
 * Enterprise state config reflecting the physical store limits.
 */
export class CommerceConfigRegistry {
  private dna: BrandDNA = {
    anchorCategory: "Premium Clothing & Jackets",
    minimumGrossMargin: 0.35,
    brandTier: "premium",
    coreMarkets: ["FR", "IT"],
    longTermGoal12MonthGMV: "Grow GMV by +50% via organic French retention"
  };

  public getBrandDNA(): BrandDNA {
    return this.dna;
  }

  public updateBrandDNA(updated: Partial<BrandDNA>): void {
    this.dna = { ...this.dna, ...updated };
  }
}
