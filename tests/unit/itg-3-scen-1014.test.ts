import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能", () => {
  // SCEN-1014
  test("新規案件の顧客条件が過去成功パターンと完全一致する場合、適用可能スコアが最高値になる", () => {
    const pastSuccessPattern = {
      industry: "製造業",
      employeeRange: "501-1000",
      challenge: "生産効率化",
      decisionMaker: "工場長",
      budgetRange: "5000万円以上",
    };

    const newCaseCustomerCondition = {
      industry: "製造業",
      employeeRange: "501-1000",
      challenge: "生産効率化",
      decisionMaker: "工場長",
      budgetRange: "5000万円以上",
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue({ relevanceScore: 1.0 }),
      findSimilarPatterns: jest
        .fn()
        .mockReturnValue([{ ...pastSuccessPattern, patternId: "PAT-001" }]),
    };

    const result = evaluatePatternRelevance(
      newCaseCustomerCondition,
      [pastSuccessPattern],
      mockAIEngine
    );

    expect(result.applicabilityScore).toBe(1.0);
    expect(result.matchedPatterns).toHaveLength(1);
    expect(result.matchedPatterns[0]).toEqual(pastSuccessPattern);
    expect(result.applicabilityScore.toFixed(2)).toBe("1.00");
  });
});