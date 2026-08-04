import { extractAndStructureSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・構造化機能", () => {
  test("SCEN-2525: 成功要因リストが欠落しているとき、例外が発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      extractSuccessFactors: jest.fn().mockReturnValue(null),
    };

    const dealCondition = {
      customerName: "株式会社テスト",
      productCategory: "クラウドERPシステム",
      budgetScale: 5000000,
      industry: "製造業",
      companySize: "中堅企業",
    };

    expect(() =>
      extractAndStructureSuccessPatterns(
        dealCondition,
        mockAIRecommendationEngine
      )
    ).toThrow(/成功要因/);
  });
});