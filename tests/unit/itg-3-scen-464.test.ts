import { evaluatePatternRelevance } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導施策推奨機能", () => {
  // SCEN-464
  test("スコアが最低水準（0～20点）の場合、「即座の対処」が推奨される", () => {
    const customerData = {
      industry: "製造業",
      dealStage: "初期接触",
      budgetScale: "小規模",
      issueClarity: "低い",
    };

    const dealData = {
      customerId: "CUST-001",
      dealId: "DEAL-001",
      pattern: customerData,
    };

    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 15,
        matchingFactors: ["industry_mismatch", "budget_mismatch"],
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = evaluatePatternRelevance(dealData, aiRecommendationEngineStub);

    expect(result.recommendedAction).toBe("即座の対処");
    expect(result.priority).toBe("CRITICAL");
    expect(result.reasoning).toMatch(/スコア0～20点/);
    expect(result.reasoning).toMatch(/即座の顧客対応/);
    expect(result.reasoning).toMatch(/課題ヒアリング/);
    expect(result.reasoning).toMatch(/関係構築/);
    expect(result.reasoning).toMatch(/迅速なフォローアップ/);
    expect(result.reasoning).toMatch(/失注リスク低減/);
    expect(result.reasoning).toMatch(/顧客ニーズ把握/);
  });
});