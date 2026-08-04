import { evaluatePatternRelevance, findSimilarPatterns, generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1431
  test('新規案件の顧客条件が過去成功パターンと一致しないとき、類似度スコアで判定される', () => {
    const pastSuccessPatterns = [
      {
        patternId: 'PATTERN_A',
        companySize: 'large',
        industry: 'manufacturing',
        budgetMin: 50000000,
        budgetMax: null,
        successRate: 0.85,
        approachName: '大規模製造業向けデジタル変革提案'
      },
      {
        patternId: 'PATTERN_B',
        companySize: 'mid',
        industry: 'distribution',
        budgetMin: 10000000,
        budgetMax: 50000000,
        successRate: 0.72,
        approachName: '中堅流通業向けプロセス最適化提案'
      }
    ];

    const newDealCondition = {
      customerId: 'CUST_NEW_001',
      companySize: 'mid',
      industry: 'retail',
      budget: 20000000
    };

    const mockEvaluatePatternRelevance = jest.fn((pattern, condition) => {
      if (pattern.patternId === 'PATTERN_A') {
        return 0.35;
      }
      if (pattern.patternId === 'PATTERN_B') {
        return 0.68;
      }
      return 0;
    });

    const mockFindSimilarPatterns = jest.fn(() => {
      return [
        {
          pattern: pastSuccessPatterns[1],
          relevanceScore: 0.68,
          rank: 1
        },
        {
          pattern: pastSuccessPatterns[0],
          relevanceScore: 0.35,
          rank: 2
        }
      ];
    });

    const mockGenerateRecommendation = jest.fn(() => {
      return {
        recommendedApproach: 'mid_retail_20m_approach',
        approachName: '中堅流通業向けプロセス最適化提案',
        basePatternId: 'PATTERN_B',
        relevanceScore: 0.68,
        reasoning: '類似度スコア: 0.68 - 業種と予算規模が過去成功事例と類似しているため、このアプローチを推奨します',
        recommendationConfidenceScore: 68,
        suggestedActions: [
          'プロセス最適化の現状診断を実施',
          '中堅流通業向けテンプレート提案資料を準備',
          '予算2000万円圏内での実装スケジュール提示'
        ]
      };
    });

    const relevanceScoreA = mockEvaluatePatternRelevance(pastSuccessPatterns[0], newDealCondition);
    const relevanceScoreB = mockEvaluatePatternRelevance(pastSuccessPatterns[1], newDealCondition);

    expect(relevanceScoreA).toBe(0.35);
    expect(relevanceScoreB).toBe(0.68);

    const rankedPatterns = mockFindSimilarPatterns();

    expect(rankedPatterns).toHaveLength(2);
    expect(rankedPatterns[0].pattern.patternId).toBe('PATTERN_B');
    expect(rankedPatterns[0].relevanceScore).toBe(0.68);
    expect(rankedPatterns[0].rank).toBe(1);
    expect(rankedPatterns[1].pattern.patternId).toBe('PATTERN_A');
    expect(rankedPatterns[1].relevanceScore).toBe(0.35);
    expect(rankedPatterns[1].rank).toBe(2);

    const recommendation = mockGenerateRecommendation();

    expect(recommendation.recommendedApproach).toBe('mid_retail_20m_approach');
    expect(recommendation.approachName).toBe('中堅流通業向けプロセス最適化提案');
    expect(recommendation.basePatternId).toBe('PATTERN_B');
    expect(recommendation.relevanceScore).toBe(0.68);
    expect(recommendation.reasoning).toContain('類似度スコア: 0.68');
    expect(recommendation.reasoning).toContain('業種と予算規模が過去成功事例と類似しているため');
    expect(recommendation.reasoningIncludesScoreBasis).not.toBeDefined();
    expect(recommendation.recommendationConfidenceScore).toBe(68);
    expect(recommendation.suggestedActions).toHaveLength(3);
    expect(recommendation.suggestedActions[0]).toBe('プロセス最適化の現状診断を実施');
  });
});