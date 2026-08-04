import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-201
  test("[normal] 推奨内容に対して根拠情報が0件のとき、根拠なしと表示される", () => {
    const recommendation_id = "REC-001";
    const content = "提案アプローチA";
    const recommendation = {
      recommendation_id,
      content,
    };

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
    };

    const result = explainRecommendationReasoning(
      recommendation,
      mockAIEngine as any
    );

    expect(result).resolves.toEqual({
      recommendation_id,
      content,
      reasoning: [],
      display_message: "根拠情報がありません",
      has_reasoning: false,
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendation
    );
  });
});