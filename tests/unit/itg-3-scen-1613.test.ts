import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理 - 同日購買の一致度計算', () => {
  // SCEN-1613
  test('過去顧客の購買日と提案日が同日のとき、期間パラメータが無視されて一致度が計算される', () => {
    const now = new Date('2025-01-15T10:00:00Z');
    const targetDate = new Date('2025-01-15T14:00:00Z');

    const historicalCustomer = {
      customerId: 'CUST-A001',
      purchaseDate: now,
      purchaseAmount: 5000000,
      industry: 'manufacturing',
    };

    const proposalCustomer = {
      customerId: 'CUST-B001',
      proposalDate: targetDate,
      industry: 'manufacturing',
      scale: 'large',
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => ({
        similarityScore: 75,
        matchedPatterns: [
          {
            patternId: 'PATTERN-001',
            relevanceScore: 75,
          },
        ],
      })),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = findSimilarPatterns(
      historicalCustomer,
      proposalCustomer,
      mockAIEngine,
    );

    expect(result).toEqual({
      similarityScore: 75,
      matchedPatterns: [
        {
          patternId: 'PATTERN-001',
          relevanceScore: 75,
        },
      ],
      daysDifference: 0,
      periodConsideredInCalculation: false,
    });

    expect(result.daysDifference).toBe(0);
    expect(result.periodConsideredInCalculation).toBe(false);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: 'manufacturing',
      }),
      expect.objectContaining({
        industry: 'manufacturing',
      }),
    );
  });
});