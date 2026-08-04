import { calculateDataQualityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質スコア算出", () => {
  // SCEN-416
  test("複数件の検証結果から平均スコアが正しく算出される", () => {
    const mockValidationResults = [
      { patternId: "P001", relevanceScore: 0.85 },
      { patternId: "P002", relevanceScore: 0.75 },
      { patternId: "P003", relevanceScore: 0.9 },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(mockValidationResults),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const calculatedScore = calculateDataQualityScore(mockValidationResults);

    const expectedAverageScore = (0.85 + 0.75 + 0.9) / 3;

    expect(calculatedScore).toBeCloseTo(expectedAverageScore, 4);
    expect(calculatedScore).toBeCloseTo(0.8333, 4);
  });
});