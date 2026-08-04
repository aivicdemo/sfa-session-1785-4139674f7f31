import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1627
  test('推奨妥当性スコア算出機能 - 購買履歴が複数件で提案内容1件の場合、全履歴を考慮したスコアが算出される', () => {
    const purchaseHistoryA = {
      id: 'hist-001',
      customerId: 'cust-12345',
      purchaseDate: new Date('2024-07-15T09:30:00Z'),
      productCategory: 'machinery',
      purchaseAmount: 500000,
      purchaseInterval: null,
    };

    const purchaseHistoryB = {
      id: 'hist-002',
      customerId: 'cust-12345',
      purchaseDate: new Date('2024-10-15T10:00:00Z'),
      productCategory: 'consumables',
      purchaseAmount: 100000,
      purchaseInterval: 92,
    };

    const purchaseHistoryC = {
      id: 'hist-003',
      customerId: 'cust-12345',
      purchaseDate: new Date('2024-11-15T11:15:00Z'),
      productCategory: 'machinery',
      purchaseAmount: 800000,
      purchaseInterval: 31,
    };

    const proposalContent = {
      id: 'prop-001',
      customerId: 'cust-12345',
      targetCategory: 'machinery_maintenance_service',
      description: 'Machine equipment maintenance service package',
      proposedAmount: 150000,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 78,
        reasoning: 'Based on 3 purchase history records: Past machinery purchases (2 instances) demonstrate stability. Consumption pattern shows regular maintenance needs at 30-92 day intervals.',
      }),
    };

    const result = evaluateRecommendationRelevance(
      {
        purchaseHistories: [purchaseHistoryA, purchaseHistoryB, purchaseHistoryC],
        proposal: proposalContent,
      },
      mockAIEngine
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        purchaseHistories: expect.arrayContaining([
          expect.objectContaining({
            id: 'hist-001',
            customerId: 'cust-12345',
            productCategory: 'machinery',
            purchaseAmount: 500000,
          }),
          expect.objectContaining({
            id: 'hist-002',
            customerId: 'cust-12345',
            productCategory: 'consumables',
            purchaseAmount: 100000,
          }),
          expect.objectContaining({
            id: 'hist-003',
            customerId: 'cust-12345',
            productCategory: 'machinery',
            purchaseAmount: 800000,
          }),
        ]),
        proposal: expect.objectContaining({
          targetCategory: 'machinery_maintenance_service',
          proposedAmount: 150000,
        }),
      })
    );

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    expect(result.score).toBe(78);
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);

    expect(result.reasoning).toContain('3 purchase history records');
    expect(result.reasoning).toContain('Past machinery purchases');
    expect(result.reasoning).toContain('2 instances');
    expect(result.reasoning).toContain('maintenance needs');
    expect(result.reasoning).toContain('intervals');
  });
});