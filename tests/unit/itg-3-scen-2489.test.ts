import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンマスタの参照機能 - 外部API失敗時の代替処理', () => {
  // SCEN-2489
  test('should return matched patterns from internal master when external AI API fails', async () => {
    const dealCondition = {
      customerIndustry: '製造業',
      dealSize: '500万円～1000万円',
      decisionMaker: '部長級',
      proposalPeriod: '2週間以内',
    };

    const failedAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error('API timeout')),
      findSimilarPatterns: jest.fn().mockRejectedValue(new Error('API timeout')),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(new Error('API timeout')),
      evaluatePatternRelevance: jest.fn().mockRejectedValue(new Error('API timeout')),
    };

    const result = await findSimilarPatterns(dealCondition, failedAIEngine);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result.length).toBeLessThanOrEqual(5);

    result.forEach((pattern: any) => {
      expect(pattern).toHaveProperty('patternId');
      expect(pattern).toHaveProperty('patternName');
      expect(pattern).toHaveProperty('successRate');
      expect(pattern).toHaveProperty('matchScore');
      expect(pattern).toHaveProperty('briefReasoning');

      expect(typeof pattern.patternId).toBe('string');
      expect(pattern.patternId).toMatch(/^PATTERN-/);

      expect(typeof pattern.patternName).toBe('string');
      expect(pattern.patternName.length).toBeGreaterThan(0);

      expect(typeof pattern.successRate).toBe('number');
      expect(pattern.successRate).toBeGreaterThanOrEqual(70);
      expect(pattern.successRate).toBeLessThanOrEqual(100);

      expect(typeof pattern.matchScore).toBe('number');
      expect(pattern.matchScore).toBeGreaterThanOrEqual(0.7);
      expect(pattern.matchScore).toBeLessThanOrEqual(1.0);

      expect(typeof pattern.briefReasoning).toBe('string');
      expect(pattern.briefReasoning.length).toBeGreaterThanOrEqual(50);
      expect(pattern.briefReasoning.length).toBeLessThanOrEqual(100);
    });

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].matchScore).toBeGreaterThanOrEqual(result[i + 1].matchScore);
    }

    expect(result[0].matchScore).toBeGreaterThanOrEqual(0.75);
    expect(result[0].successRate).toBeGreaterThanOrEqual(75);

    const patternNames = [
      result[0].patternName,
      result[1].patternName,
      result.length > 2 ? result[2].patternName : undefined,
    ].filter(Boolean);

    expect(patternNames.some((name: any) => name.includes('製造業') || name.includes('段階'))).toBe(true);
  });
});