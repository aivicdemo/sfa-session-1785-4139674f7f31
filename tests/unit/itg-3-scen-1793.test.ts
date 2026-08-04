import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1793
  test("[normal] 推奨根拠の可視化機能 - 根拠が複数回生成されても同じ結果が返却される（べき等性）", () => {
    const dealData = {
      customerName: "A社",
      industry: "製造業",
      budget: 5000000,
      challenge: "生産効率化",
    };

    const expectedReasoningExplanation =
      "過去5件の類似案件で成功率80%。提案アプローチ：コスト削減重視";
    const expectedScorePercentage = 80;
    const expectedRecommendationPatternId = "PATTERN_001";

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => ({
        reasoningText: expectedReasoningExplanation,
        scorePercentage: expectedScorePercentage,
        recommendationPatternId: expectedRecommendationPatternId,
      })),
    };

    const reasoningResult_1 = explainRecommendationReasoning(
      dealData,
      mockAIEngine
    );

    const reasoningResult_2 = explainRecommendationReasoning(
      dealData,
      mockAIEngine
    );

    const reasoningResult_3 = explainRecommendationReasoning(
      dealData,
      mockAIEngine
    );

    expect(reasoningResult_1.reasoningText).toBe(expectedReasoningExplanation);
    expect(reasoningResult_1.scorePercentage).toBe(expectedScorePercentage);
    expect(reasoningResult_1.recommendationPatternId).toBe(
      expectedRecommendationPatternId
    );

    expect(reasoningResult_2.reasoningText).toBe(expectedReasoningExplanation);
    expect(reasoningResult_2.scorePercentage).toBe(expectedScorePercentage);
    expect(reasoningResult_2.recommendationPatternId).toBe(
      expectedRecommendationPatternId
    );

    expect(reasoningResult_3.reasoningText).toBe(expectedReasoningExplanation);
    expect(reasoningResult_3.scorePercentage).toBe(expectedScorePercentage);
    expect(reasoningResult_3.recommendationPatternId).toBe(
      expectedRecommendationPatternId
    );

    expect(reasoningResult_1).toEqual(reasoningResult_2);
    expect(reasoningResult_2).toEqual(reasoningResult_3);
    expect(reasoningResult_1).toEqual(reasoningResult_3);
  });
});