import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ適用可能性判定機能", () => {
  // SCEN-2242
  test("抽出された成功パターンが新規案件に適用可能かスコア化される", () => {
    const past_success_pattern = {
      patternId: "PAT-001",
      industry: "製造業",
      dealSize: 5000000,
      decisionPeriodDays: 90,
    };

    const new_deal_condition = {
      industry: "製造業",
      dealSize: 4800000,
      decisionPeriodDays: 75,
    };

    const result = evaluatePatternRelevance(
      past_success_pattern,
      new_deal_condition
    );

    expect(result.patternId).toBe("PAT-001");
    expect(typeof result.relevanceScore).toBe("number");
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.75);
    expect(Array.isArray(result.matchedFactors)).toBe(true);
    expect(Array.isArray(result.unmatchedFactors)).toBe(true);
    expect(result.matchedFactors).toContain("業種一致");
    expect(result.matchedFactors).toContain("規模帯類似");
    expect(result.unmatchedFactors).toContain("決定期間差異");
  });
});