import { evaluatePatternRelevance, findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - 適合度閾値判定', () => {
  test('SCEN-1289: 適合度79.9%の成功パターンが閾値80.0%未満として除外される', () => {
    const RELEVANCE_THRESHOLD = 80.0;
    const BELOW_THRESHOLD_SCORE = 79.9;
    const ABOVE_THRESHOLD_SCORE = 85.5;

    const dealCondition = {
      customerId: 'cust_12345',
      customerSize: 'mid_enterprise',
      industry: 'manufacturing',
      budgetAmount: 5000000,
      dealStage: 'proposal',
    };

    const patternBelowThreshold = {
      patternId: 'pattern_001',
      name: 'Mid-size Manufacturing Success Pattern',
      relevanceScore: BELOW_THRESHOLD_SCORE,
      description: 'Pattern with score 79.9%',
    };

    const patternAboveThreshold = {
      patternId: 'pattern_002',
      name: 'High-relevance Manufacturing Pattern',
      relevanceScore: ABOVE_THRESHOLD_SCORE,
      description: 'Pattern with score 85.5%',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((pattern, condition) => {
        if (pattern.patternId === 'pattern_001') {
          return { score: BELOW_THRESHOLD_SCORE, applicable: false };
        }
        if (pattern.patternId === 'pattern_002') {
          return { score: ABOVE_THRESHOLD_SCORE, applicable: true };
        }
        return { score: 0, applicable: false };
      }),
      findSimilarPatterns: jest.fn((condition) => ({
        patterns: [patternBelowThreshold, patternAboveThreshold],
        totalMatches: 2,
      })),
    };

    const result = findSimilarPatterns(
      dealCondition,
      mockAIEngine,
      RELEVANCE_THRESHOLD
    );

    expect(result.includedPatterns).toHaveLength(1);
    expect(result.includedPatterns[0].patternId).toBe('pattern_002');
    expect(result.includedPatterns[0].relevanceScore).toBe(ABOVE_THRESHOLD_SCORE);

    expect(result.excludedPatterns).toHaveLength(1);
    expect(result.excludedPatterns[0].patternId).toBe('pattern_001');
    expect(result.excludedPatterns[0].relevanceScore).toBe(BELOW_THRESHOLD_SCORE);
    expect(result.excludedPatterns[0].reason).toMatch(/Below threshold/);
    expect(result.excludedPatterns[0].threshold).toBe(RELEVANCE_THRESHOLD);

    expect(result.hasRecommendablePatterns).toBe(true);
    expect(result.recommendedCount).toBe(1);
    expect(result.excludedCount).toBe(1);
  });
});