import { evaluateProposalConstraintAlignment } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1396
  test("提案内容が0件のとき、照合結果が空集合として返却される", async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const customerConstraints = {
      budgetUpperLimit: 1000000,
      implementationDeadline: "2026-03-31",
      targetDepartment: "営業部",
    };

    const result = await evaluateProposalConstraintAlignment(
      customerConstraints,
      mockAIRecommendationEngine
    );

    expect(result.matchedProposals).toEqual([]);
    expect(result.matchedConstraints).toEqual([]);
    expect(result.status).toBe(200);
    expect(result.error).toBeUndefined();
  });
});