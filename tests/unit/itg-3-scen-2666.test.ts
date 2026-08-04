import { evaluateSuccessPatternApplicability } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  test("SCEN-2666: 商談条件が欠落しているとき、判定不可として処理される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealConditionWithMissingBudget = {
      customerName: "顧客A",
      customerIndustry: null,
      productCategory: "ソリューション",
    };

    const result = evaluateSuccessPatternApplicability(
      dealConditionWithMissingBudget,
      mockAIEngine
    );

    expect(result.status).toBe("INDETERMINATE");
    expect(result.missingFields).toContain("customerIndustry");
    expect(result.errorMessage).toMatch(/顧客業種/);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});