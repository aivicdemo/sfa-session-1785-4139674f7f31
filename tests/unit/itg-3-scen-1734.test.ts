import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能", () => {
  // SCEN-1734
  test("適用可能性評価値がちょうど0.5のとき推奨スコアを正確に計算する", () => {
    const mock_evaluatePatternRelevance = jest.fn().mockReturnValue(0.5);

    const dealCondition = {
      customerId: "CUST_20240115_001",
      industryCode: "IT_SERVICES",
      companySize: "LARGE",
      dealValue: 5000000,
      dealStage: "PROPOSAL",
      timelineWeeks: 12,
      evaluatePatternRelevance: mock_evaluatePatternRelevance,
    };

    const result = evaluatePatternRelevance(dealCondition);

    expect(mock_evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(result).toBe(0.5);
    expect(typeof result).toBe("number");
    expect(Number.isNaN(result)).toBe(false);
    expect(Number.isFinite(result)).toBe(true);

    const recommendationScore = result * 100;
    expect(recommendationScore).toBe(50.0);
    expect(recommendationScore).toBeGreaterThanOrEqual(0);
    expect(recommendationScore).toBeLessThanOrEqual(100);
  });
});