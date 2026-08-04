import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  test("SCEN-2663: 商談条件マッチスコアが閾値直上（80.1%）のとき、適用対象として判定される", async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 80.1,
        isApplicable: true,
      }),
    };

    const dealCondition = {
      customerIndustry: "manufacturing",
      budgetRange: "5000000-10000000",
      purchaseCycle: "quarterly",
      decisionMakerCount: 3,
      implementationTimeline: 90,
    };

    const result = await evaluatePatternRelevance(
      dealCondition,
      mockAIEngine
    );

    expect(result.isApplicable).toBe(true);
    expect(result.score).toBe(80.1);
    expect(result.recommendationFlag).toBe(true);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      dealCondition
    );
  });
});