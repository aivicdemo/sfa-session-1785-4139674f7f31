import { recordRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2361
  test("同一の根拠スコアが複数の推奨に対して記録されるとき各推奨ごとにレコードが追加される", () => {
    const recommendationId_A = "rec-001";
    const recommendationId_B = "rec-002";
    const recommendationId_C = "rec-003";
    const commonReasoningScore = 0.85;
    const dealId = "deal-2361-001";

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendations: [
          {
            id: recommendationId_A,
            approach: "提案アプローチA",
            reasoningScore: commonReasoningScore,
          },
          {
            id: recommendationId_B,
            approach: "提案アプローチB",
            reasoningScore: commonReasoningScore,
          },
          {
            id: recommendationId_C,
            approach: "提案アプローチC",
            reasoningScore: commonReasoningScore,
          },
        ],
      }),
    };

    const dealCondition = {
      dealId: dealId,
      customerIndustry: "IT",
      customerScale: 500,
      proposalContent: "クラウドソリューション提案",
    };

    const recordedReasons = recordRecommendationReasoning(
      dealCondition,
      mockAIEngine
    );

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      dealCondition
    );
    expect(recordedReasons).toHaveLength(3);

    expect(recordedReasons[0]).toEqual({
      recommendationId: recommendationId_A,
      reasoningScore: commonReasoningScore,
      dealId: dealId,
    });

    expect(recordedReasons[1]).toEqual({
      recommendationId: recommendationId_B,
      reasoningScore: commonReasoningScore,
      dealId: dealId,
    });

    expect(recordedReasons[2]).toEqual({
      recommendationId: recommendationId_C,
      reasoningScore: commonReasoningScore,
      dealId: dealId,
    });

    const scoreCount = recordedReasons.filter(
      (r) => r.reasoningScore === 0.85
    ).length;
    expect(scoreCount).toBe(3);

    const uniqueRecommendationIds = new Set(
      recordedReasons.map((r) => r.recommendationId)
    );
    expect(uniqueRecommendationIds.size).toBe(3);
  });
});