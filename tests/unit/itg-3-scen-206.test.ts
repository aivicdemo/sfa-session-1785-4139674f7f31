import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('Past deal success pattern extraction and recommendation (SCEN-206)', () => {
  test('SCEN-206: should exclude patterns with relevance score below threshold and include patterns at or above threshold', async () => {
    // Arrange
    const pastDealsData = [
      {
        dealId: 'deal_001',
        industry: '製造業',
        companySize: '中堅企業',
        issue: '生産効率化',
        proposalApproach: 'パターンA',
        result: 'won',
      },
      {
        dealId: 'deal_002',
        industry: '製造業',
        companySize: '中堅企業',
        issue: '生産効率化',
        proposalApproach: 'パターンB',
        result: 'won',
      },
      {
        dealId: 'deal_003',
        industry: '製造業',
        companySize: '中堅企業',
        issue: '生産効率化',
        proposalApproach: 'パターンC',
        result: 'won',
      },
      {
        dealId: 'deal_004',
        industry: '製造業',
        companySize: '中堅企業',
        issue: '生産効率化',
        proposalApproach: 'パターンD',
        result: 'won',
      },
      {
        dealId: 'deal_005',
        industry: '製造業',
        companySize: '中堅企業',
        issue: '生産効率化',
        proposalApproach: 'パターンE',
        result: 'won',
      },
    ];

    const newDealConditions = {
      industry: '製造業',
      companySize: '中堅企業',
      issue: '生産効率化',
    };

    const relevanceThreshold = 0.75;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn((pattern) => {
        const scoreMap: { [key: string]: number } = {
          'パターンA': 0.74,
          'パターンB': 0.76,
          'パターンC': 0.79,
          'パターンD': 0.65,
          'パターンE': 0.80,
        };
        return scoreMap[pattern] || 0;
      }),
    };

    // Act
    const result = await generateRecommendation(
      newDealConditions,
      pastDealsData,
      relevanceThreshold,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ patternName: 'パターンB', relevanceScore: 0.76 }),
        expect.objectContaining({ patternName: 'パターンC', relevanceScore: 0.79 }),
        expect.objectContaining({ patternName: 'パターンE', relevanceScore: 0.80 }),
      ])
    );

    const recommendedPatternNames = result.recommendedPatterns.map(
      (p: { patternName: string }) => p.patternName
    );
    expect(recommendedPatternNames).not.toContain('パターンA');
    expect(recommendedPatternNames).not.toContain('パターンD');

    const excludedPatterns = result.excludedPatterns || [];
    expect(excludedPatterns).toContainEqual(
      expect.objectContaining({ patternName: 'パターンA', relevanceScore: 0.74 })
    );
    expect(excludedPatterns).toContainEqual(
      expect.objectContaining({ patternName: 'パターンD', relevanceScore: 0.65 })
    );

    expect(result.recommendationReasonings).toHaveLength(3);
    const reasoningPatternNames = result.recommendationReasonings.map(
      (r: { patternName: string }) => r.patternName
    );
    expect(reasoningPatternNames).toEqual(
      expect.arrayContaining(['パターンB', 'パターンC', 'パターンE'])
    );
    expect(reasoningPatternNames).not.toContain('パターンA');
    expect(reasoningPatternNames).not.toContain('パターンD');
  });
});