import { calculatePriorityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度スコアリング", () => {
  test("SCEN-458: 影響度がちょうど閾値の場合、優先度スコアに正しく反映される", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.5),
    };

    const scoringParams = {
      impact: 0.5,
      urgency: 0.6,
      implementationDifficulty: 0.4,
      customerSatisfaction: 0.7,
    };

    const weightedScore =
      scoringParams.impact * 0.4 +
      scoringParams.urgency * 0.3 +
      scoringParams.customerSatisfaction * 0.2 +
      (1 - scoringParams.implementationDifficulty) * 0.1;

    const expectedPriorityScore = 0.59;

    const result = calculatePriorityScore(scoringParams);

    expect(result).toEqual({
      priorityScore: expectedPriorityScore,
      priorityLevel: "medium",
      thresholdMet: true,
    });

    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});