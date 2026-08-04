import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIRecommendationEngine.findSimilarPatterns - External API failure fallback', () => {
  // SCEN-246
  test('should return internal pattern master results when OpenAI API fails with retry exhaustion', async () => {
    // Mock stub for AIRecommendationEngine with OpenAI API failure
    const failingAIEngine = {
      findSimilarPatterns: jest.fn().mockRejectedValue(new Error('API request failed')),
    };

    // Internal pattern master data
    const internalPatternMaster = [
      {
        patternId: 'P001',
        successRate: 0.92,
        industry: 'IT',
        dealType: 'SaaS初期導入',
        briefReasoning: '過去成功事例のみ表示',
      },
      {
        patternId: 'P002',
        successRate: 0.87,
        industry: 'IT',
        dealType: 'SaaS初期導入',
        briefReasoning: '過去成功事例のみ表示',
      },
      {
        patternId: 'P003',
        successRate: 0.79,
        industry: '製造',
        dealType: '保守契約更新',
        briefReasoning: '過去成功事例のみ表示',
      },
    ];

    // Input deal condition
    const dealCondition = {
      industry: 'IT',
      dealType: 'SaaS初期導入',
      budget: '500万円',
    };

    // Call findSimilarPatterns with external engine stub and fallback data
    const result = await findSimilarPatterns(
      dealCondition,
      failingAIEngine,
      internalPatternMaster
    );

    // Verify retry attempts occurred (3 retries with exponential backoff)
    expect(failingAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(3);

    // Verify fallback result structure and content
    expect(result).toEqual({
      patterns: [
        {
          patternId: 'P001',
          successRate: 0.92,
          industry: 'IT',
          dealType: 'SaaS初期導入',
          briefReasoning: '過去成功事例のみ表示',
        },
        {
          patternId: 'P002',
          successRate: 0.87,
          industry: 'IT',
          dealType: 'SaaS初期導入',
          briefReasoning: '過去成功事例のみ表示',
        },
      ],
      fallbackMode: true,
      source: 'internal_pattern_master',
    });

    // Verify patterns are sorted by success rate descending
    expect(result.patterns[0].successRate).toBeGreaterThan(
      result.patterns[1].successRate
    );

    // Verify each pattern has brief reasoning
    result.patterns.forEach((pattern) => {
      expect(pattern.briefReasoning).toBe('過去成功事例のみ表示');
    });

    // Verify fallback indicators are present
    expect(result.fallbackMode).toBe(true);
    expect(result.source).toBe('internal_pattern_master');
  });
});