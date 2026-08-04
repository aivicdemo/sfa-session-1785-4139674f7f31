import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1524
  test('品質判定結果が学習データ利用不可なときAIエージェント呼び出し可能フラグがfalseで返される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const purchaseHistoryData = {
      customerId: 'CUST-001',
      purchaseCount: 1,
      totalAmount: 10000,
      lastPurchaseDate: '2024-01-01T00:00:00Z',
      categoryDistribution: {},
      frequencyPattern: null,
      dataCompleteness: 0.4,
      dataConsistency: 0.3,
    };

    const qualityAssessmentResult = evaluatePurchaseHistoryDataQuality(
      purchaseHistoryData,
      mockAIRecommendationEngine
    );

    expect(qualityAssessmentResult.canCallAIRecommendationEngine).toBe(false);
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});