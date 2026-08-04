import { evaluateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 成功パターン適用可能性評価', () => {
  test('SCEN-2436: 適用可能性スコア1.0のパターンが最大重みで組み込まれる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((patternId: string, customerAttributes: any, dealConditions: any) => {
        if (patternId === 'pattern_perfect_match') {
          return 1.0;
        } else if (patternId === 'pattern_high_match') {
          return 0.8;
        } else if (patternId === 'pattern_medium_match') {
          return 0.5;
        }
        return 0.3;
      }),
    };

    const testData = {
      patterns: [
        {
          patternId: 'pattern_perfect_match',
          customerAttributes: {
            industry: 'IT',
            employeeCount: 500,
            annualRevenue: 10000000,
          },
          dealConditions: {
            productCategory: 'cloud_solution',
            dealStage: 'proposal',
            estimatedValue: 500000,
          },
        },
        {
          patternId: 'pattern_high_match',
          customerAttributes: {
            industry: 'IT',
            employeeCount: 450,
            annualRevenue: 9500000,
          },
          dealConditions: {
            productCategory: 'cloud_solution',
            dealStage: 'negotiation',
            estimatedValue: 480000,
          },
        },
        {
          patternId: 'pattern_medium_match',
          customerAttributes: {
            industry: 'Finance',
            employeeCount: 300,
            annualRevenue: 5000000,
          },
          dealConditions: {
            productCategory: 'cloud_solution',
            dealStage: 'qualification',
            estimatedValue: 250000,
          },
        },
      ],
    };

    const result = evaluateRecommendationScore(testData, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.recommendationScore).toBeGreaterThanOrEqual(0);
    expect(result.recommendationScore).toBeLessThanOrEqual(100);
    expect(result.patternWeights).toBeDefined();
    expect(Array.isArray(result.patternWeights)).toBe(true);
    expect(result.patternWeights.length).toBe(3);

    const perfectMatchWeight = result.patternWeights.find(
      (pw: any) => pw.patternId === 'pattern_perfect_match'
    )?.weight;
    const highMatchWeight = result.patternWeights.find(
      (pw: any) => pw.patternId === 'pattern_high_match'
    )?.weight;
    const mediumMatchWeight = result.patternWeights.find(
      (pw: any) => pw.patternId === 'pattern_medium_match'
    )?.weight;

    expect(perfectMatchWeight).toBeGreaterThan(highMatchWeight);
    expect(highMatchWeight).toBeGreaterThan(mediumMatchWeight);

    const recommendedPattern = result.patternWeights.reduce((prev: any, current: any) =>
      prev.weight > current.weight ? prev : current
    );
    expect(recommendedPattern.patternId).toBe('pattern_perfect_match');
    expect(recommendedPattern.weight).toBe(perfectMatchWeight);

    expect(result.recommendationScore).toBeGreaterThan(70);
  });
});