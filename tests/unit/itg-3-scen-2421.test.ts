import { evaluateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2421
  test('過去成功パターンが複数件のときすべてが信頼度計算に反映される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'pattern_a',
          relevanceScore: 0.95,
          successRate: 0.92,
          caseCount: 45,
        },
        {
          patternId: 'pattern_b',
          relevanceScore: 0.87,
          successRate: 0.85,
          caseCount: 38,
        },
        {
          patternId: 'pattern_c',
          relevanceScore: 0.79,
          successRate: 0.78,
          caseCount: 31,
        },
      ]),
    };

    const newDealInput = {
      customerIndustry: '製造業',
      budgetAmount: 5000000,
      decisionMakerCount: 3,
      dealStage: 'initial_contact',
    };

    const result = evaluateRecommendationConfidenceScore(
      newDealInput,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealInput
    );

    const expectedScore =
      (0.95 * 0.92 + 0.87 * 0.85 + 0.79 * 0.78) / 3;
    expect(result.confidenceScore).toBeCloseTo(expectedScore, 2);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.74);
    expect(result.confidenceScore).toBeLessThanOrEqual(0.75);

    expect(result.patternsUsedCount).toBe(3);
    expect(result.includesAllPatterns).toBe(true);

    expect(result.patternBreakdown).toHaveLength(3);
    expect(result.patternBreakdown[0]).toEqual({
      patternId: 'pattern_a',
      relevanceScore: 0.95,
      successRate: 0.92,
      contribution: 0.95 * 0.92,
    });
    expect(result.patternBreakdown[1]).toEqual({
      patternId: 'pattern_b',
      relevanceScore: 0.87,
      successRate: 0.85,
      contribution: 0.87 * 0.85,
    });
    expect(result.patternBreakdown[2]).toEqual({
      patternId: 'pattern_c',
      relevanceScore: 0.79,
      successRate: 0.78,
      contribution: 0.79 * 0.78,
    });
  });
});