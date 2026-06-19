export interface PolicyRule {
  ruleId: string;
  expression: string;
  errorMessage: string;
  severity: "block" | "warn" | "audit";
}

/**
 * Brand-Governance Policy checker executing DSL validations on state changes.
 */
export class GovernancePolicyDSL {
  private rules: PolicyRule[] = [
    {
      ruleId: "RULE_MIN_GROSS_MARGIN",
      expression: "product.profitMargin >= 0.35",
      errorMessage: "Operational action violates base DNA policy: profit margin must protect the 35% premium floor.",
      severity: "block"
    },
    {
      ruleId: "RULE_CORE_MARKETS_ONLY",
      expression: "['FR', 'IT', 'DE', 'ES'].includes(targetCountry)",
      errorMessage: "Operational action violates strategic geographic boundaries: limited to core European zones.",
      severity: "block"
    },
    {
      ruleId: "RULE_AD_BUDGET_CAP",
      expression: "action.adSpendAllocated <= 5000",
      errorMessage: "Ad campaign adjustment exceeds automated financial threshold. Requires CFO manual approval approval.",
      severity: "warn"
    }
  ];

  /**
   * Registers a new custom policy rule
   */
  public registerCustomRule(rule: PolicyRule): void {
    this.rules.push(rule);
  }

  /**
   * Evaluates if a specified pricing change or campaign launch conforms to active merchant governance rules.
   */
  public evaluatePricingMargin(price: number, cost: number): { passed: boolean; message: string } {
    const profitMargin = price > 0 ? (price - cost) / price : 0;
    
    if (profitMargin < 0.35) {
      const rule = this.rules.find(r => r.ruleId === "RULE_MIN_GROSS_MARGIN");
      return {
        passed: false,
        message: rule ? rule.errorMessage : "Gross margin threshold not respected."
      };
    }

    return { passed: true, message: "Validates against margin compliance." };
  }

  /**
   * Evaluates marketing target geographic locations
   */
  public evaluateGeographics(targetCountry: string): { passed: boolean; message: string } {
    const allowed = ["FR", "IT", "DE", "ES"];
    if (!allowed.includes(targetCountry)) {
      const rule = this.rules.find(r => r.ruleId === "RULE_CORE_MARKETS_ONLY");
      return {
        passed: false,
        message: rule ? rule.errorMessage : "Unapproved target region."
      };
    }
    return { passed: true, message: "Authorized geographic zone confirmed." };
  }

  public getRules(): PolicyRule[] {
    return this.rules;
  }
}
