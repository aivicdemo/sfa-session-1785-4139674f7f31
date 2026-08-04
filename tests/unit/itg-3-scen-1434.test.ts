import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1434
  test('複数の成功パターンが同一の類似度スコアを持つとき、すべてが推奨候補に含まれる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PATTERN_A',
          patternName: 'パターンA',
          similarityScore: 0.85,
          industry: '製造業',
          budgetRange: '500万円',
          decisionPeriod: '2ヶ月',
          successRate: 0.92,
        },
        {
          patternId: 'PATTERN_B',
          patternName: 'パターンB',
          similarityScore: 0.85,
          industry: '製造業',
          budgetRange: '500万円',
          decisionPeriod: '2ヶ月',
          successRate: 0.88,
        },
        {
          patternId: 'PATTERN_C',
          patternName: 'パターンC',
          similarityScore: 0.85,
          industry: '製造業',
          budgetRange: '500万円',
          decisionPeriod: '2ヶ月',
          successRate: 0.90,
        },
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealCondition = {
      industry: '製造業',
      budgetScale: 5000000,
      decisionPeriod: 60,
      customerId: 'CUST_12345',
      dealAmount: 5000000,
      dealStatus: 'initial_proposal',
    };

    const result = generateRecommendation(newDealCondition, mockAIEngine);

    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ patternId: 'PATTERN_A' }),
        expect.objectContaining({ patternId: 'PATTERN_B' }),
        expect.objectContaining({ patternId: 'PATTERN_C' }),
      ])
    );

    result.recommendedPatterns.forEach((pattern) => {
      expect(pattern.similarityScore).toBe(0.85);
    });

    const patternIds = result.recommendedPatterns.map((p) => p.patternId);
    const sortedIds = [...patternIds].sort();
    expect(patternIds).toEqual(sortedIds);
  });
});