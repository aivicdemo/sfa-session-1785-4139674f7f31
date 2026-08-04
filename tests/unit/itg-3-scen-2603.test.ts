import { generateRecommendationPattern } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンテンプレート自動判定機能', () => {
  // SCEN-2603
  test('同じ顧客属性と商談条件で2回実行した場合、同一の推奨パターンが返却される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn((customerAttribute, dealCondition) => {
        return {
          patternId: 'PATTERN-2024-0847',
          proposalApproach: 'CTO向けのテクニカルROI比較資料を優先提供',
          reasoning: '過去同条件の成功事例8件中7件でこのアプローチが採用され、成約率85%を達成'
        };
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const customerAttribute = {
      industry: 'IT',
      employeeCount: '50-100',
      budgetRange: '10000000'
    };

    const dealCondition = {
      proposalContent: 'クラウド導入',
      decisionMaker: 'CTO',
      leadSource: '展示会'
    };

    const firstResult = generateRecommendationPattern(customerAttribute, dealCondition, mockAIEngine);
    const secondResult = generateRecommendationPattern(customerAttribute, dealCondition, mockAIEngine);

    expect(firstResult.patternId).toBe('PATTERN-2024-0847');
    expect(secondResult.patternId).toBe('PATTERN-2024-0847');
    expect(firstResult.patternId).toBe(secondResult.patternId);

    expect(firstResult.proposalApproach).toBe('CTO向けのテクニカルROI比較資料を優先提供');
    expect(secondResult.proposalApproach).toBe('CTO向けのテクニカルROI比較資料を優先提供');
    expect(firstResult.proposalApproach).toBe(secondResult.proposalApproach);

    expect(firstResult.reasoning).toBe('過去同条件の成功事例8件中7件でこのアプローチが採用され、成約率85%を達成');
    expect(secondResult.reasoning).toBe('過去同条件の成功事例8件中7件でこのアプローチが採用され、成約率85%を達成');
    expect(firstResult.reasoning).toBe(secondResult.reasoning);
  });
});