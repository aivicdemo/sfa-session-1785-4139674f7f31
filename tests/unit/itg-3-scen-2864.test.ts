import { validateRecommendationContent } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2864
  test("成約実績との相関係数が負の値のとき、エラーを返す", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 45,
        correlationCoefficient: -0.15,
      }),
    };

    const recommendationContent = {
      recommendationId: "rec_001",
      customerId: "cust_123",
      proposalApproachId: "approach_456",
      successPatternId: "pattern_789",
      correlationCoefficient: -0.15,
      confidenceScore: 45,
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const result = validateRecommendationContent(
      recommendationContent,
      mockAIEngine
    );

    expect(result).toEqual({
      isValid: false,
      errorCode: "NEGATIVE_CORRELATION_ERROR",
      errorMessage:
        "成約実績との相関係数が負の値のため、推奨内容は採用できません",
      details: {
        correlationCoefficient: -0.15,
      },
    });
  });
});