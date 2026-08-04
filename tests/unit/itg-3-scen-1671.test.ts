import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1671
  test('[error] 推奨スコア算出機能 - 購買履歴データに金額フィールドが欠けているとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'test_approach',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('test reason'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const purchaseHistoryWithMissingAmount = [
      {
        id: 'purchase_001',
        customerId: 'cust_123',
        productId: 'prod_456',
        quantity: 5,
        amount: 50000,
        purchaseDate: '2024-01-15',
      },
      {
        id: 'purchase_002',
        customerId: 'cust_123',
        productId: 'prod_789',
        quantity: 3,
      },
      {
        id: 'purchase_003',
        customerId: 'cust_123',
        productId: 'prod_101',
        quantity: 2,
        amount: 75000,
        purchaseDate: '2024-02-20',
      },
    ];

    const recommendationInput = {
      customerId: 'cust_123',
      purchaseHistory: purchaseHistoryWithMissingAmount,
      proposalContent: {
        productId: 'prod_999',
        proposedAmount: 100000,
        recommendedTiming: '2024-03-01',
      },
    };

    expect(() =>
      calculateRecommendationScore(recommendationInput, mockAIEngine)
    ).toThrow(/金額フィールド|金額情報/);
  });
});