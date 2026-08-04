import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用推奨機能 - 顧客制約条件と提案アプローチの矛盾検出', () => {
  // SCEN-1592
  test('顧客の制約条件が提案アプローチと矛盾するとき、エラーが発生する', () => {
    const customerConstraints = {
      budgetLimit: 1000000,
      implementationPeriod: 3,
      targetDepartments: ['営業部']
    };

    const proposedApproach = {
      name: 'エンタープライズ向け統合導入パッケージ',
      estimatedBudget: 5000000,
      implementationDuration: 12,
      targetScope: '全社展開'
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.15,
        contradictions: [
          {
            type: 'budget_exceeded',
            detail: '予算超過（提案500万円 > 制約100万円）'
          },
          {
            type: 'duration_exceeded',
            detail: '導入期間超過（提案12ヶ月 > 制約3ヶ月）'
          },
          {
            type: 'scope_mismatch',
            detail: '対象範囲不一致（提案: 全社展開 ≠ 制約: 営業部のみ）'
          }
        ]
      })
    };

    expect(() => {
      evaluatePatternRelevance(
        customerConstraints,
        proposedApproach,
        mockAIRecommendationEngine
      );
    }).toThrow(/矛盾/);
  });
});