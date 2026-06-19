/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../../../types";

export interface ConstitutionalClause {
  id: string;
  articleSlug: string;
  statementChinese: string;
  isImmutable: boolean;
  severity: "CRITICAL" | "HIGH" | "ADVISORY";
}

export interface ConstitutionalAuditReport {
  vettedOk: boolean;
  appliedBylawMatchesCount: number;
  violatedArticles: string[];
  firmRestrictionOverridingSignReq: boolean;
}

export class AgentConstitution {
  private bylaws: ConstitutionalClause[] = [
    {
      id: "ART-01-COST",
      articleSlug: "UNIT_COST_PROTECTION_ACT",
      statementChinese: "任何商品定价均不得低于其基础进货成本价以保护底线毛利。",
      isImmutable: true,
      severity: "CRITICAL",
    },
    {
      id: "ART-02-CFO",
      articleSlug: "CFO_LIQUIDITY_RESERVE_CAP",
      statementChinese: "批量货运供应链重构或一次性进货支出超过10,000元，需触发CFO财务权限验证。",
      isImmutable: true,
      severity: "CRITICAL",
    },
    {
      id: "ART-03-AUDIT",
      articleSlug: "PERSISTENT_AUDITABILITY_MATE",
      statementChinese: "一切商业决策与自主行动必须完整落入不可篡改的溯源指纹日志以供企业核查。",
      isImmutable: true,
      severity: "CRITICAL",
    },
  ];

  public getBylaws(): ConstitutionalClause[] {
    return this.bylaws;
  }

  /**
   * Conducts an unbypassable, constitutional vet over proposed action parameters.
   */
  public vetActionConformity(
    suggestedValue: number,
    actionType: "price" | "restock",
    product: Product
  ): ConstitutionalAuditReport {
    const violatedArticles: string[] = [];
    let firmRestrictionOverridingSignReq = false;

    // Unit Cost protective check
    if (actionType === "price" && suggestedValue < product.costPrice) {
      violatedArticles.push(`ART-01-COST [UNIT_COST_PROTECTION_ACT]: Suggested price (¥${suggestedValue}) is below unit purchase cost (¥${product.costPrice}). Action blocked.`);
      firmRestrictionOverridingSignReq = true;
    }

    // CFO financial limits check
    if (actionType === "restock") {
      const estimatedCost = suggestedValue * product.costPrice;
      if (estimatedCost > 10000) {
        violatedArticles.push(`ART-02-CFO [CFO_LIQUIDITY_RESERVE_CAP]: Estimated restocking cost (¥${estimatedCost}) exceeds standard limit caps. Requires double-signature authorization.`);
        firmRestrictionOverridingSignReq = true;
      }
    }

    return {
      vettedOk: violatedArticles.length === 0,
      appliedBylawMatchesCount: this.bylaws.length,
      violatedArticles,
      firmRestrictionOverridingSignReq,
    };
  }
}
