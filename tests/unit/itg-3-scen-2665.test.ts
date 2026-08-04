import { evaluateSuccessPatternDeterminability } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  // SCEN-2665
  test("顧客属性が空文字列のとき、判定不可として処理される", () => {
    const dealCondition = {
      customerAttribute: "",
      dealSize: 5000000,
      industry: "製造業",
      dealStage: "提案段階",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluateSuccessPatternDeterminability(
      dealCondition,
      mockAIEngine
    );

    expect(result.status).toBe("UNDETERMINABLE");
    expect(result.isDeterminable).toBe(false);
    expect(result.recommendation).toBeNull();
    expect(result.errorMessage).toMatch(/顧客属性/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});