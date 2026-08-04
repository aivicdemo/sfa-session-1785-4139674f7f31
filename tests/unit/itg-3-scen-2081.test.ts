import { evaluateProposalDeviation } from "../../src/logic/it-1-br-3-1-1-1";

// Mock AIRecommendationEngine
jest.mock("../../src/services/AIRecommendationEngine", () => ({
  AIRecommendationEngine: jest.fn().mockImplementation(() => ({
    evaluatePatternRelevance: jest.fn().mockResolvedValue({
      deviationScore: 51,
    }),
  })),
}));

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2081
  test("[normal] 提案内容と顧客対応パターンの標準プロセス照合分析 - 提案内容の乖離スコアが 51 のとき、中程度の乖離と判定される", async () => {
    const proposalContent = {
      customerId: "cust-001",
      productCategory: "software",
      proposedApproach: "digital_transformation",
      proposalAmount: 500000,
    };

    const customerResponsePattern = {
      contactFrequency: "monthly",
      responseTime: "3_days",
      engagementLevel: "active",
    };

    const aiEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue({ deviationScore: 51 }),
    };

    const result = await evaluateProposalDeviation(
      proposalContent,
      customerResponsePattern,
      aiEngine
    );

    expect(result.deviationScore).toBe(51);
    expect(result.deviationLevel).toBe("MEDIUM");
    expect(result.deviationLevelLabel).toBe("中程度");
    expect(result.classificationRange).toEqual({
      min: 41,
      max: 60,
    });
  });
});