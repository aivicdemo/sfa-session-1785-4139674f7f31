import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1836
  test("顧客IDが null のとき根拠情報取得に失敗する", () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    expect(() =>
      explainRecommendationReasoning(null, {
        recommendationId: "rec-001",
        dealId: "deal-001",
        engine: mockAIRecommendationEngine,
      })
    ).toThrow(/顧客ID/);

    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).not.toHaveBeenCalled();
  });
});