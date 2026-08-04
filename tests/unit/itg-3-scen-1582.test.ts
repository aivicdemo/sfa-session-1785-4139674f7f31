import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン適用推奨機能", () => {
  test("SCEN-1582: 現在の商談条件が空のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const emptyDealConditions = {};

    expect(() =>
      generateRecommendation(emptyDealConditions, mockAIRecommendationEngine)
    ).toThrow(/商談条件|dealConditions/);

    expect(
      mockAIRecommendationEngine.generateRecommendation
    ).not.toHaveBeenCalled();
  });
});