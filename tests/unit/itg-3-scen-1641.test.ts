import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1641
  test('[normal] 推奨妥当性スコア算出機能 - 購買履歴の発生日時が古い順に並ぶ場合、スコアが正しく算出される', () => {
    const purchaseHistory = [
      {
        purchase_id: 'PUR001',
        purchase_date: '2024-01-15T09:00:00Z',
        product_category: 'software',
        amount: 50000,
      },
      {
        purchase_id: 'PUR002',
        purchase_date: '2024-03-20T14:30:00Z',
        product_category: 'software',
        amount: 75000,
      },
      {
        purchase_id: 'PUR003',
        purchase_date: '2024-06-10T11:00:00Z',
        product_category: 'software',
        amount: 100000,
      },
    ];

    const proposalContent = {
      proposal_id: 'PROP001',
      customer_id: 'CUST001',
      recommended_product_category: 'software',
      recommended_amount: 120000,
      recommended_timing: '2024-07-15T10:00:00Z',
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((purchase, proposal) => {
          const dateDiff = Math.abs(
            new Date(proposal.recommended_timing).getTime() -
              new Date(purchase.purchase_date).getTime(),
          );
          const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
          const categoryMatch =
            purchase.product_category === proposal.recommended_product_category
              ? 1
              : 0.5;
          const amountRatio = proposal.recommended_amount / purchase.amount;
          const relevanceScore = Math.min(
            100,
            Math.max(
              0,
              (1 - daysDiff / 365) * 0.4 +
                categoryMatch * 0.3 +
                Math.min(amountRatio, 2) * 15,
            ),
          );
          return Math.round(relevanceScore * 100) / 100;
        }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const resultScore = evaluateRecommendationRelevance(
      purchaseHistory,
      proposalContent,
      mockAIRecommendationEngine,
    );

    expect(typeof resultScore).toBe('number');
    expect(resultScore).toBeGreaterThanOrEqual(0);
    expect(resultScore).toBeLessThanOrEqual(100);
    expect(resultScore).toBeGreaterThan(0.6);
    expect(resultScore).toBeLessThan(1.0);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(
      3,
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      1,
      purchaseHistory[0],
      proposalContent,
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      2,
      purchaseHistory[1],
      proposalContent,
    );
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(
      3,
      purchaseHistory[2],
      proposalContent,
    );

    expect(resultScore).toBeCloseTo(0.75, 1);
  });
});