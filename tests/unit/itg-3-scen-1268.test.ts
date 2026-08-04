import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";
import { AIRecommendationEngine } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1268
  test("[edge] 提案妥当性判定機能 - リスク要因の重要度が高い場合と低い場合でスコア計算結果が異なる", () => {
    const mockAIEngine: Partial<AIRecommendationEngine> = {
      evaluatePatternRelevance: jest.fn((conditions: unknown) => {
        const cond = conditions as {
          riskLevel?: string;
          industryVolatility?: string;
          implementationRisk?: string;
        };
        if (
          cond.riskLevel === "high" ||
          cond.industryVolatility === "high" ||
          cond.implementationRisk === "high"
        ) {
          return 0.65;
        }
        return 0.85;
      }),
    };

    const highRiskCondition = {
      customerId: "CUST001",
      dealId: "DEAL001",
      industryVolatility: "high",
      implementationRisk: "high",
      riskLevel: "high",
      productCategory: "enterprise",
      budgetAmount: 5000000,
      timelineWeeks: 12,
    };

    const highRiskScore = evaluateProposalValidity(
      highRiskCondition,
      mockAIEngine as AIRecommendationEngine
    );

    const lowRiskCondition = {
      customerId: "CUST001",
      dealId: "DEAL001",
      industryVolatility: "low",
      implementationRisk: "low",
      riskLevel: "low",
      productCategory: "enterprise",
      budgetAmount: 5000000,
      timelineWeeks: 12,
    };

    const lowRiskScore = evaluateProposalValidity(
      lowRiskCondition,
      mockAIEngine as AIRecommendationEngine
    );

    expect(highRiskScore).toBeLessThanOrEqual(lowRiskScore - 10);
    expect(highRiskScore).toBe(65);
    expect(lowRiskScore).toBe(85);
  });
});