import { evaluateRecommendationValidity } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容検証判定機能", () => {
  // SCEN-2886
  test("過去商談データから成功パターンが0件抽出されたとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealAmount: 5000000,
      dealStage: "提案準備",
      dealConditions: {
        budgetConstraint: 10000000,
        scheduleConstraint: "2024-12-31",
      },
    };

    expect(() =>
      evaluateRecommendationValidity(newDealData, mockAIRecommendationEngine)
    ).toThrow(/成功パターン/);
  });
});