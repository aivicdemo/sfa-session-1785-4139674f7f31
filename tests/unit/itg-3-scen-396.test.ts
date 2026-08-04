import { verifyInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-396
  test('推論精度検証機能 - 検証実行時点での比較成功パターンが0件のとき、精度基準値が初期値として設定', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const currentInferenceData = {
      customerId: 'CUST-001',
      dealStatus: 'negotiation',
      proposalContent: 'Enterprise Solution Package',
      historicalContext: {
        previousSuccessfulDeals: [],
        failurePatterns: [],
      },
    };

    const DEFAULT_ACCURACY_THRESHOLD = 0.0;

    const result = verifyInferenceAccuracy(
      currentInferenceData,
      mockAIRecommendationEngine
    );

    expect(result.accuracyThreshold).toBe(DEFAULT_ACCURACY_THRESHOLD);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        dealStatus: 'negotiation',
        proposalContent: 'Enterprise Solution Package',
      })
    );
  });
});