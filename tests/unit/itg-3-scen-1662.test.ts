import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1662: [error] 推奨スコア算出機能 - 顧客の制約条件 (購入不可カテゴリ) に抵触する提案のとき、エラーが発生する
  test('should throw error when proposal category violates customer purchase restriction constraint', () => {
    const customerId = 'CUST-001';
    const customerConstraint = {
      customerId,
      purchaseForbiddenCategories: ['電子機器'],
      budgetLimit: 1000000,
      maxPurchaseFrequencyPerYear: 12
    };

    const proposalContent = {
      proposalId: 'PROP-001',
      customerId,
      category: '電子機器',
      amount: 500000,
      description: 'LED照明システム導入提案'
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'Direct proposal',
        proposalContent: proposalContent,
        confidenceScore: 85
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      calculateRecommendationScore(
        customerConstraint,
        proposalContent,
        aiRecommendationEngineStub
      );
    }).toThrow(/購入不可カテゴリ/);
  });
});