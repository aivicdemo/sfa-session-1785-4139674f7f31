import { calculateImprovementPriorityRank } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 改善優先度ランク算出", () => {
  // SCEN-526: [edge] 改善優先度ランク算出機能 - 優先度判定対象が1件のときランクが正確に算出される
  test("単一の改善案件に対して改善優先度ランクが正確に算出される", () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.88),
    };

    const improvementData = {
      improvementId: "IMP-001",
      importanceScore: 85,
      feasibilityScore: 72,
      businessImpactScore: 90,
    };

    const expectedRankValue = 85 * 72 * 90 * 0.88;
    const expectedRankValue_calculated = 48600.96;

    // Act
    const result = calculateImprovementPriorityRank(
      [improvementData],
      mockAIRecommendationEngine
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(1);

    const rankResult = result[0];
    expect(rankResult.improvementId).toBe("IMP-001");
    expect(rankResult.rankValue).toBeCloseTo(expectedRankValue_calculated, 2);
    expect(rankResult.rankCategory).toBe("A");
    expect(rankResult.scoreBreakdown).toEqual({
      importanceScore: 85,
      feasibilityScore: 72,
      businessImpactScore: 90,
      applicabilityScore: 0.88,
    });
    expect(rankResult.relativeRanking).toBeUndefined();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      improvementData
    );
  });
});