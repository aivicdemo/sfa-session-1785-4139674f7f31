import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-229
  test("推奨根拠の成功パターンマッチスコアが101のとき、根拠表示処理がエラーになる", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternMatchScore: 101,
        isApplicable: true,
        confidenceLevel: 0.95,
      }),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: "製造業",
      customerSize: "大規模",
      productCategory: "システム導入",
      budgetRange: "1000万円以上",
      dealStage: "提案段階",
    };

    expect(() =>
      explainRecommendationReasoning(dealCondition, mockAIRecommendationEngine)
    ).toThrow(/パターンマッチスコア/);
  });
});