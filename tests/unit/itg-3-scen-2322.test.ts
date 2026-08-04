import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-2322
  test("適用可能な成功パターンが0件のとき提案アプローチ候補が空配列で返却される", async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue([]),
    };

    const newDealData = {
      customerId: "C001",
      customerIndustry: "manufacturing",
      customerScale: "mid-size",
      dealAmount: 5000000,
      dealStage: "negotiation",
      dealConditions: {
        budget_constraint: 5000000,
        timeline_months: 3,
        required_features: ["scalability", "integration"],
      },
    };

    const result = await findSimilarPatterns(
      newDealData,
      mockAIRecommendationEngine
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});