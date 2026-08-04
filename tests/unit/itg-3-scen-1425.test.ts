import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-1425
  test("類似パターンマッチスコアが閾値未満のとき、適用不可と判定される", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.35,
        isRelevant: false,
        reason: "類似パターンマッチスコア0.35は閾値0.5以下のため、このパターンは適用不可と判定されました"
      })
    };

    const newDealCondition = {
      customerIndustry: "IT",
      budgetSize: 5000000,
      implementationPeriodMonths: 3,
      dealStage: "initial_proposal"
    };

    const result = generateRecommendation(
      newDealCondition,
      mockAIEngine
    );

    expect(result.applicability.isApplicable).toBe(false);
    expect(result.applicability.reason).toBe(
      "類似パターンマッチスコア0.35は閾値0.5以下のため、このパターンは適用不可と判定されました"
    );
    expect(result.recommendedApproach).toBeNull();
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});