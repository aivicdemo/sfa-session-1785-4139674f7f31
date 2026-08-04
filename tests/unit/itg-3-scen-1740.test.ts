import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1740: 推奨根拠が0件のとき根拠リストを空配列で返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationId = "rec_20240115_001";
    const result = explainRecommendationReasoning(
      recommendationId,
      mockAIRecommendationEngine
    );

    expect(result).resolves.toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });
});