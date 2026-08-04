import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度スコア算出機能 - 顧客条件部分一致時の重み付け", () => {
  // SCEN-2426
  test("顧客条件が部分一致した成功パターンの重み付けが最大値未満となる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.65),
    };

    const currentCustomerCondition = {
      industry: "製造業",
      companyScale: "中堅企業",
      challenge: "生産効率化",
      budget: "5000万円以上",
    };

    const successPattern = {
      industry: "製造業",
      companyScale: "大企業",
      challenge: "生産効率化",
      budget: "10億円以上",
    };

    const result = evaluatePatternRelevance(
      currentCustomerCondition,
      successPattern,
      mockAIEngine
    );

    expect(result).toBeLessThanOrEqual(0.65);
    expect(result).toBeLessThan(1.0);
  });
});