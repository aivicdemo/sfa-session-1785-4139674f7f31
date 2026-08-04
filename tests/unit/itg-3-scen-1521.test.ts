import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation - Consistency Verification', () => {
  // SCEN-1521
  test('should return identical quality scores when evaluating the same purchase history dataset twice consecutively', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const purchaseHistoryDataset = [
      {
        customerId: 'CUST001',
        productCategory: 'software',
        purchaseAmount: 50000,
        purchaseDateTime: '2024-01-15T09:30:00Z',
      },
      {
        customerId: 'CUST001',
        productCategory: 'software',
        purchaseAmount: 75000,
        purchaseDateTime: '2024-02-20T14:15:00Z',
      },
      {
        customerId: 'CUST002',
        productCategory: 'hardware',
        purchaseAmount: 120000,
        purchaseDateTime: '2024-01-10T11:00:00Z',
      },
      {
        customerId: 'CUST002',
        productCategory: 'software',
        purchaseAmount: 45000,
        purchaseDateTime: '2024-03-05T10:45:00Z',
      },
      {
        customerId: 'CUST003',
        productCategory: 'service',
        purchaseAmount: 200000,
        purchaseDateTime: '2024-02-28T16:20:00Z',
      },
    ];

    const scoreFirst = evaluatePurchaseHistoryDataQuality(
      purchaseHistoryDataset,
      mockAIRecommendationEngine
    );

    const scoreSecond = evaluatePurchaseHistoryDataQuality(
      purchaseHistoryDataset,
      mockAIRecommendationEngine
    );

    expect(scoreFirst).toBe(0.85);
    expect(scoreSecond).toBe(0.85);
    expect(scoreFirst).toBe(scoreSecond);
    expect(scoreFirst).toStrictEqual(scoreSecond);
  });
});