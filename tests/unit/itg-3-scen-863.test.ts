import { calculateRecommendationConfidenceScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-863: [edge] 推奨信頼度スコア算出機能 - 信頼度スコアが閾値100ちょうどで算出される
  test("信頼度スコアが閾値100ちょうどで算出される場合、スコア値が正確に100.0として返される", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.0),
    };

    const dealConditions = {
      customerIndustry: "製造業",
      dealSize: "大規模案件",
      proposalContent: "DX推進コンサルティング",
      customerScale: "従業員1000名以上",
    };

    const result = calculateRecommendationConfidenceScore(
      dealConditions,
      mockAIRecommendationEngine
    );

    expect(result.confidenceScore).toBe(100.0);
    expect(result.trustLevel).toBe("最高信頼");
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealConditions
    );
  });
});