import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2423
  test('マッチした成功パターンが1件のときスコアが計算される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pattern_001',
          relevanceScore: 0.85,
          dealValue: 5000000,
          conversionRate: 0.75,
          customerIndustry: 'manufacturing',
          dealSize: 'large',
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealConditions = {
      customerIndustry: 'manufacturing',
      customerSize: 'large',
      dealAmount: 4500000,
      salesStage: 'proposal',
    };

    const result = await evaluateRecommendationScore(
      dealConditions,
      mockAIEngine
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      dealConditions
    );
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
    expect(result.score).toBeCloseTo(0.78, 2);
    expect(result.patternCount).toBe(1);
    expect(result.factors).toEqual({
      relevanceScore: 0.85,
      dealValueNormalized: expect.any(Number),
      conversionRate: 0.75,
    });
    expect(result.factors.relevanceScore).toBe(0.85);
    expect(result.factors.conversionRate).toBe(0.75);
  });
});