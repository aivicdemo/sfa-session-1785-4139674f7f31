import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  // SCEN-2516: [edge] 成功パターンが0件のとき、空配列を返す
  test("成功パターンが0件のとき、空配列を返す", () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealConditions = {
      customer_industry: "製造業",
      customer_scale: "中堅企業",
      deal_stage: "提案検討中",
      budget_range: 5000000,
      timeline_months: 6,
    };

    const result = extractSuccessPatterns(dealConditions, mockAIRecommendationEngine);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(dealConditions);
  });
});