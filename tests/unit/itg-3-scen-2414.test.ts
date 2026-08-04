import { calculateRecommendationAccuracyScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2414
  test('推奨精度スコア算出機能 - 推奨精度スコアが0点のときスコア値0が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0,
        confidenceScore: 0,
        patternMatchPercentage: 0,
      }),
    };

    const recommendationInput = {
      customerId: 'CUST-20240115-001',
      dealId: 'DEAL-20240115-001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      proposalContent: 'proposal with zero relevance',
      historicalPatterns: [],
    };

    const result = calculateRecommendationAccuracyScore(
      recommendationInput,
      mockAIRecommendationEngine
    );

    expect(typeof result).toBe('number');
    expect(result).toBe(0);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-20240115-001',
        dealId: 'DEAL-20240115-001',
      })
    );
  });
});