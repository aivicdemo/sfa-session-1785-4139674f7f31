import { validateRecommendationContent } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2868
  test("標準プロセスとの乖離度が負の値のとき、エラーを返す", () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      recommendationId: "rec-001",
      proposalContent: "提案内容テスト",
      processDeviationScore: -0.5,
      customerResponsePattern: "standard",
      aiRecommendationEngine: aiRecommendationEngineStub,
    };

    const result = validateRecommendationContent(input);

    expect(result).toEqual({
      isValid: false,
      error: {
        code: "DEVIATION_NEGATIVE_ERROR",
        message: "標準プロセスとの乖離度は0以上の値である必要があります",
        statusCode: 400,
        details: {
          deviationScore: -0.5,
        },
      },
    });
  });
});