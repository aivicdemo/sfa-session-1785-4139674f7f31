import { getRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1763
  test("推奨内容が0件のとき根拠表示内容を空配列で返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerId: "CUST001",
      industry: "IT",
      scale: "large",
      dealValue: 5000000,
    };

    const result = getRecommendationReasoning(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual([]);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
  });
});