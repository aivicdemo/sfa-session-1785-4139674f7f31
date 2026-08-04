import { validateRecommendationContent } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2863
  test("推奨内容が空のとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      recommendationContent: "",
      aiEngine: mockAIRecommendationEngine,
    };

    const result = validateRecommendationContent(input);

    expect(result).toEqual({
      isValid: false,
      errorCode: "RECOMMENDATION_CONTENT_EMPTY",
      errorMessage: "推奨内容（改善提案）が入力されていません",
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});