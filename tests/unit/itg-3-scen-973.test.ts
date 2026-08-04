import { mapRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-973
  test('[error] 推奨内容の根拠表示機能 - 提案内容の商品IDが未設定のとき、根拠マッピング処理が開始されず警告が返される', () => {
    const aiRecommendationEngineMock = {
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationWithoutProductId = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      proposalContent: {
        productId: null,
        proposalText: 'Sample proposal',
        proposedAmount: 50000,
      },
      recommendedTiming: '2024-02-15',
      confidenceScore: 85,
      basePatterns: [
        {
          patternId: 'pat-001',
          successRate: 0.78,
          appliedCount: 12,
        },
      ],
    };

    const result = mapRecommendationReasoning(
      recommendationWithoutProductId,
      aiRecommendationEngineMock
    );

    expect(result).toEqual({
      code: 'PRODUCT_ID_NOT_SET',
      message: '提案内容の商品IDが未設定のため、根拠マッピング処理を開始できません',
      severity: 'warning',
    });

    expect(aiRecommendationEngineMock.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});