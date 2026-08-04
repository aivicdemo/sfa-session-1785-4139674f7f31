import { generateRecommendationWithPatternMatching } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1341
  test('過去商談データが複数件のとき、すべてのパターンが新規案件と照合される', () => {
    const pastDeals = [
      {
        dealId: 'deal_001',
        customerIndustry: '製造業',
        budgetAmount: 50000000,
        implementationQuarter: 'Q2',
        dealStatus: 'won',
        approachMethod: 'consultative_selling',
        dealValue: 45000000,
      },
      {
        dealId: 'deal_002',
        customerIndustry: '製造業',
        budgetAmount: 48000000,
        implementationQuarter: 'Q2',
        dealStatus: 'won',
        approachMethod: 'value_proposition',
        dealValue: 40000000,
      },
      {
        dealId: 'deal_003',
        customerIndustry: '製造業',
        budgetAmount: 52000000,
        implementationQuarter: 'Q3',
        dealStatus: 'won',
        approachMethod: 'executive_engagement',
        dealValue: 35000000,
      },
    ];

    const newDealInput = {
      customerIndustry: '製造業',
      budgetAmount: 50000000,
      implementationQuarter: 'Q2',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockImplementation(() => [
        { dealId: 'deal_001', similarityScore: 0.85 },
        { dealId: 'deal_002', similarityScore: 0.72 },
        { dealId: 'deal_003', similarityScore: 0.68 },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((dealId) => {
          const scores: Record<string, number> = {
            deal_001: 0.82,
            deal_002: 0.7,
            deal_003: 0.65,
          };
          return scores[dealId] || 0;
        }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation((dealId) => {
          const explanations: Record<string, string> = {
            deal_001:
              'High similarity in industry and budget. Consultative selling approach recommended.',
            deal_002:
              'Strong match on implementation timeline. Value proposition focus aligns well.',
            deal_003:
              'Similar budget scale. Executive engagement strategy applicable.',
          };
          return explanations[dealId] || '';
        }),
      generateRecommendation: jest.fn().mockImplementation(() => ({
        recommendedApproach: 'consultative_selling',
        confidenceScore: 0.82,
      })),
    };

    const result = generateRecommendationWithPatternMatching(
      newDealInput,
      pastDeals,
      mockAIEngine
    );

    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns[0].dealId).toBe('deal_001');
    expect(result.recommendedPatterns[0].similarityScore).toBe(0.85);
    expect(result.recommendedPatterns[0].relevanceScore).toBe(0.82);
    expect(result.recommendedPatterns[0].suggestedApproach).toBe(
      'consultative_selling'
    );
    expect(result.recommendedPatterns[0].reasoning).toContain('High similarity');

    expect(result.recommendedPatterns[1].dealId).toBe('deal_002');
    expect(result.recommendedPatterns[1].similarityScore).toBe(0.72);
    expect(result.recommendedPatterns[1].relevanceScore).toBe(0.7);
    expect(result.recommendedPatterns[1].suggestedApproach).toBe(
      'value_proposition'
    );

    expect(result.recommendedPatterns[2].dealId).toBe('deal_003');
    expect(result.recommendedPatterns[2].similarityScore).toBe(0.68);
    expect(result.recommendedPatterns[2].relevanceScore).toBe(0.65);
    expect(result.recommendedPatterns[2].suggestedApproach).toBe(
      'executive_engagement'
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(3);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      'deal_001'
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      'deal_002'
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      'deal_003'
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      1,
      'deal_001'
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      2,
      'deal_002'
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
      3,
      'deal_003'
    );

    expect(result.recommendedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dealId: 'deal_001',
          similarityScore: 0.85,
          relevanceScore: 0.82,
        }),
        expect.objectContaining({
          dealId: 'deal_002',
          similarityScore: 0.72,
          relevanceScore: 0.7,
        }),
        expect.objectContaining({
          dealId: 'deal_003',
          similarityScore: 0.68,
          relevanceScore: 0.65,
        }),
      ])
    );
  });
});