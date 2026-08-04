import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1667: パターン適用可能性スコアが0のとき、PatternRelevanceErrorが発生する", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    const newDealInfo = {
      customerName: "テスト顧客",
      dealAmount: 5000000,
      industry: "情報通信",
      companySize: "mid",
    };

    const expectedErrorMessage = "パターン適用スコアが閾値未満です。スコア: 0";
    const expectedErrorCode = "PATTERN_RELEVANCE_ZERO";

    expect(() => {
      evaluatePatternRelevance(newDealInfo, mockAIRecommendationEngine);
    }).toThrow(/パターン適用スコア/);

    try {
      evaluatePatternRelevance(newDealInfo, mockAIRecommendationEngine);
    } catch (error: any) {
      expect(error.message).toContain(expectedErrorMessage);
      expect(error.errorcode).toBe(expectedErrorCode);
    }
  });
});