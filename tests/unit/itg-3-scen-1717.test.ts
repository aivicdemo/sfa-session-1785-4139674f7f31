import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能 - 購買履歴重複排除', () => {
  // SCEN-1717
  test('購買履歴が重複データを含むとき推奨スコアを重複を排除して計算する', () => {
    const mockEvaluatePatternRelevance = jest.fn((pattern: any) => {
      return 75;
    });

    const purchaseHistoryWithDuplicates = [
      {
        productId: 'PROD-001',
        customerId: 'CUST-A',
        purchaseAmount: 50000,
        purchaseDate: '2024-01-15',
      },
      {
        productId: 'PROD-001',
        customerId: 'CUST-A',
        purchaseAmount: 50000,
        purchaseDate: '2024-01-15',
      },
      {
        productId: 'PROD-002',
        customerId: 'CUST-A',
        purchaseAmount: 30000,
        purchaseDate: '2024-02-20',
      },
    ];

    const proposalContent = {
      productId: 'PROD-001',
      proposedAmount: 50000,
      proposedTiming: '2024-03-01',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const result = calculateRecommendationScore(
      purchaseHistoryWithDuplicates,
      proposalContent,
      mockAIEngine
    );

    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(2);

    const callArgs = mockEvaluatePatternRelevance.mock.calls;
    expect(callArgs[0][0]).toEqual({
      productId: 'PROD-001',
      customerId: 'CUST-A',
      purchaseAmount: 50000,
      purchaseDate: '2024-01-15',
    });
    expect(callArgs[1][0]).toEqual({
      productId: 'PROD-002',
      customerId: 'CUST-A',
      purchaseAmount: 30000,
      purchaseDate: '2024-02-20',
    });

    expect(result).toEqual({
      score: 75,
      deduplicatedPatternCount: 2,
      originalDataCount: 3,
    });
  });
});