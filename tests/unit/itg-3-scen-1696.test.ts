import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1696
  test("照合評価スコアが0未満のとき、エラーが発生する", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const newDealData = {
      customerName: "テスト顧客A",
      industry: "製造業",
      revenue: 50000000,
      dealCondition: "新規導入",
      budget: 5000000,
    };

    expect(() =>
      evaluatePatternRelevance(newDealData, mockAIEngine)
    ).toThrow(/照合評価スコアは0以上1以下の範囲内である必要があります/);
  });
});