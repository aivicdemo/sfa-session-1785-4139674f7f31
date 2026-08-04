import { evaluateRecommendationJustification } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2889
  test("推奨根拠レコードの記録日時が null のとき、エラーを返す", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: "提案アプローチA",
        confidenceScore: 85,
        reasoning: "過去の成功パターンに基づいた推奨",
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue("説明文"),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.9),
    };

    const recommendationRecord = {
      recommendationId: "rec-001",
      customerId: "cust-001",
      dealId: "deal-001",
      recordedAt: null,
      proposalApproach: "提案アプローチA",
      confidenceScore: 85,
      justificationDataPoints: [
        {
          dataType: "past_success_pattern",
          value: "パターンX",
          weight: 0.6,
        },
      ],
    };

    const result = evaluateRecommendationJustification(
      recommendationRecord,
      mockAIEngine
    );

    expect(result).toEqual({
      isValid: false,
      errorCode: "INVALID_RECOMMENDATION_RECORD",
      errorMessage: "推奨根拠レコードの記録日時が未設定です",
      details: "recordedAt is null",
    });
  });
});