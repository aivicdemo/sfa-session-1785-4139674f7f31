import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2552: [edge] 推奨根拠の可視化機能 - 推奨根拠の信頼度スコアが閾値直上のとき、除外される
  test("信頼度スコアが閾値直上（0.70）のパターンは推奨根拠の可視化から除外される", () => {
    const dealCondition = {
      customerName: "テスト顧客A",
      industry: "製造業",
      companySize: "大企業",
      dealSize: "5000万円",
      stageName: "提案段階"
    };

    const patternRelevanceThreshold = 0.70;
    const evaluatedRelevanceScore = 0.70;

    const result = evaluatePatternRelevance(dealCondition, patternRelevanceThreshold);

    expect(result.isVisible).toBe(false);
    expect(result.relevanceScore).toBe(0.70);
    expect(result.exclusionReason).toBe("threshold");
  });
});