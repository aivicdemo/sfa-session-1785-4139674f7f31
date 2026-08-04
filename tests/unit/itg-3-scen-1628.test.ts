import { calculateRecommendationValidityScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1628: 推奨妥当性スコア算出機能 - 提案内容が0件の場合、スコアが0で算出される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: "CUST-001",
      dealAmount: 5000000,
      dealStage: "提案中",
      customerIndustry: "製造業",
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    const result = calculateRecommendationValidityScore(input);

    expect(result.score).toBe(0);
    expect(result.proposalCount).toBe(0);
    expect(result.scoreCalculationBasis).toBeDefined();
  });
});