import { validateProposalViability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1233: 提案妥当性確認判定機能 - リスク要因データが不正なスキーマのとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidRiskFactorsData = {
      proposalId: "PROP-20240115-001",
      customerId: "CUST-5001",
      proposalContent: {
        productName: "Cloud Analytics Suite",
        estimatedInvestment: 500000,
        expectedROI: 1500000,
      },
      customerConstraints: {
        budgetLimit: 800000,
        implementationDeadline: "2024-06-30",
      },
      riskFactors: [
        {
          riskId: "RISK-001",
          riskDescription: "System integration complexity",
          // 必須フィールド 'riskLevel' が欠落している
          mitigationStrategy: "Phased implementation approach",
        },
      ],
    };

    expect(() =>
      validateProposalViability(invalidRiskFactorsData, mockAIRecommendationEngine)
    ).toThrow(/INVALID_RISK_SCHEMA/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});