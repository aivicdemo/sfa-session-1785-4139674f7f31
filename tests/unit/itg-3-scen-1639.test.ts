import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1639
  test('推奨妥当性スコア算出機能 - 購買履歴が複数件で同一金額の場合、スコア算出ロジックが正しく動作する', async () => {
    const purchaseHistory = [
      {
        purchaseId: 'PUR-001',
        customerId: 'CUST-A001',
        amount: 100000,
        purchaseDate: new Date('2024-01-15T10:00:00Z'),
        productCategory: 'IT_SYSTEMS'
      },
      {
        purchaseId: 'PUR-002',
        customerId: 'CUST-A001',
        amount: 100000,
        purchaseDate: new Date('2024-03-20T11:30:00Z'),
        productCategory: 'IT_SYSTEMS'
      },
      {
        purchaseId: 'PUR-003',
        customerId: 'CUST-A001',
        amount: 100000,
        purchaseDate: new Date('2024-05-10T14:45:00Z'),
        productCategory: 'IT_SYSTEMS'
      }
    ];

    const proposalContent = {
      proposalId: 'PROP-2024-001',
      recommendedAmount: 100000,
      recommendedTiming: new Date('2024-07-01T09:00:00Z'),
      productCategory: 'IT_SYSTEMS',
      businessObjective: 'Cost optimization'
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.75)
    };

    const scoreResult = await evaluateRecommendationRelevance(
      purchaseHistory,
      proposalContent,
      mockAIEngine
    );

    expect(scoreResult).not.toBeNull();
    expect(scoreResult).not.toBeUndefined();
    expect(typeof scoreResult).toBe('number');
    expect(Number.isNaN(scoreResult)).toBe(false);
    expect(scoreResult).toBeGreaterThanOrEqual(0.0);
    expect(scoreResult).toBeLessThanOrEqual(1.0);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(scoreResult).toBe(0.75);
  });
});