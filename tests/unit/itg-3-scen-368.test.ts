import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度検証機能 - パターン関連性評価", () => {
  // SCEN-368
  test("成功パターンマッチスコアが1.0を超えるとき、パターン関連性評価がエラーになる", () => {
    const successPatternId = "pattern_001";
    const currentDealConditions = {
      customerId: "cust_123",
      industry: "manufacturing",
      companySize: "large",
      budget: 5000000,
      decisionMaker: "executive",
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue(1.05),
    };

    expect(() => {
      evaluatePatternRelevance(
        successPatternId,
        currentDealConditions,
        mockAIRecommendationEngine
      );
    }).toThrow(/パターン関連性評価エラー/);
  });
});