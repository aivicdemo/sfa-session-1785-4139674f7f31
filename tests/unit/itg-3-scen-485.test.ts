import { calculateImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク算出", () => {
  test("SCEN-485: 改善対象項目リストが空配列のとき、エラーが発生する", () => {
    const emptyImprovementItems: any[] = [];
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "test approach",
        confidenceScore: 85,
        reasoning: "test reasoning"
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue("test explanation"),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.9)
    };

    expect(() => {
      calculateImprovementPriorityRank(emptyImprovementItems, mockAIRecommendationEngine);
    }).toThrow(/改善対象項目リストが空/);
  });
});