import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-575
  test("AIRecommendationEngine.explainRecommendationReasoningの呼び出しが成功するとき自然言語説明が返される", () => {
    const recommendationPatternId = "pattern_20250801_001";
    const targetDealId = "deal_20250801_123";

    const aiRecommendationEngineStub = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "顧客A社は過去3年間で同業他社との競争環境にあり、提案内容B（コスト削減アプローチ）は同類型案件で成功率85%の実績があります。"
      ),
    };

    const result = explainRecommendationReasoning(
      recommendationPatternId,
      targetDealId,
      aiRecommendationEngineStub
    );

    expect(typeof result).toBe("string");
    expect(result).toContain("顧客A社");
    expect(result).toContain("過去3年間");
    expect(result).toContain("コスト削減アプローチ");
    expect(result).toContain("85%");
    expect(result).toContain("成功率");
    expect(result).toMatch(/成功率\d+%/);
  });
});