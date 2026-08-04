import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件への提案アプローチ推奨機能", () => {
  // SCEN-2050
  test("新規案件の適合性スコアが推奨閾値直下のとき推奨されない", () => {
    const recommendationThreshold = 0.75;
    const relevanceScore = 0.74;
    const newDealCondition = {
      industryType: "製造業",
      companySize: "中堅企業",
      challengePattern: "デジタル変革",
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(relevanceScore),
      generateRecommendation: jest.fn().mockReturnValue({
        recommendations: [],
        explanation: null,
      }),
    };

    const result = evaluatePatternRelevance(
      newDealCondition,
      recommendationThreshold,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(result.isRecommended).toBe(false);
    expect(result.recommendations).toEqual([]);
    expect(result.explanation).toBeNull();
  });
});