import { visualizeRecommendationReasons } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1570: 推奨根拠データが0件のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationId = "REC-TEST-001";

    expect(() =>
      visualizeRecommendationReasons(
        recommendationId,
        mockAIRecommendationEngine
      )
    ).toThrow(/推奨根拠データが見つかりません/);
  });
});