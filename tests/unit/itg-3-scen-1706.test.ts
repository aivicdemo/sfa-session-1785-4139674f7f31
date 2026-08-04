import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1706: 購買履歴1件の顧客に対して推奨スコアを計算する', () => {
    const customerId = 'TEST_CUST_001';
    const purchaseHistory = [
      {
        productId: 'PROD_A',
        purchaseDate: new Date('2026-01-15T00:00:00Z'),
        quantity: 1,
      },
    ];

    const similarPatterns = [
      {
        patternId: 'PAT_2025_001',
        relevanceScore: 0.68,
      },
    ];

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.45),
      findSimilarPatterns: jest.fn().mockReturnValue(similarPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const purchaseHistoryLengthCoefficient = 0.8;
    const baseScore = 0.45;
    const patternRelevanceScore = 0.68;

    const expectedScore =
      baseScore * purchaseHistoryLengthCoefficient * patternRelevanceScore;

    const result = calculateRecommendationScore(
      customerId,
      purchaseHistory,
      mockAIEngine
    );

    expect(result).toBeCloseTo(expectedScore, 5);
    expect(result).toBeGreaterThanOrEqual(0.0);
    expect(result).toBeLessThanOrEqual(1.0);
    expect(typeof result).toBe('number');

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});