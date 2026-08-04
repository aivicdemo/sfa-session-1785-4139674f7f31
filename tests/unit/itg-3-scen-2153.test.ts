import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン適用可能性の評価", () => {
  // SCEN-2153
  test("evaluatePatternRelevance が負数の評価スコアを返したとき、エラーがスローされる", () => {
    // Arrange: AIRecommendationEngine.evaluatePatternRelevance のスタブを準備
    const mockEvaluatePatternRelevance = jest
      .fn()
      .mockReturnValue({ score: -0.5 });

    const patternId = "pattern-001";
    const customerCondition = {
      industry: "製造業",
      companySize: "大企業",
      annualRevenue: 50000000,
    };
    const dealCondition = {
      productCategory: "システム統合",
      dealValue: 5000000,
      timeline: "3ヶ月",
    };

    // Act & Assert: エラーがスローされることを期待
    expect(() =>
      evaluatePatternRelevance(
        patternId,
        customerCondition,
        dealCondition,
        mockEvaluatePatternRelevance
      )
    ).toThrow(/評価スコア/);
  });
});