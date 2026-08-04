import { decideSalesCoachingPolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者指導方針決定機能', () => {
  // SCEN-506
  test('指導方針の優先順位が重複しているとき、エラーが発生する', () => {
    const duplicatePriorityPolicies = [
      {
        policyId: 'policy-001',
        policyName: '顧客ニーズ深掘り',
        priority: 1,
        description: '顧客の経営課題を詳しくヒアリングする',
      },
      {
        policyId: 'policy-002',
        policyName: '提案資料カスタマイズ',
        priority: 2,
        description: '顧客固有の制約条件を提案に反映する',
      },
      {
        policyId: 'policy-003',
        policyName: '初回接触戦略',
        priority: 1,
        description: '最初のアプローチ方法を改善する',
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        recommendedApproach: 'test approach',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      decideSalesCoachingPolicy({
        policies: duplicatePriorityPolicies,
        salesRepId: 'rep-001',
        reportingPeriod: '2024-01',
        aiEngine: mockAIRecommendationEngine,
      })
    ).toThrow(/優先順位/);
  });
});