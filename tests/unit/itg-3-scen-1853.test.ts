import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1853: 成功パターンマッチスコアが100を超えるとき根拠情報の生成に失敗する', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: 'approach-A',
        confidence: 95,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'pat-001',
          similarity: 0.92,
          successRate: 0.88,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 101,
      }),
      explainRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error('Pattern relevance score exceeds maximum threshold')
      ),
    };

    const newDealData = {
      dealId: 'deal-2024-001',
      customerIndustry: 'technology',
      customerSize: 'enterprise',
      dealAmount: 500000,
      dealStage: 'initial-contact',
      businessChallenge: 'digital transformation',
    };

    const mockCachedRecommendation = {
      recommendationId: 'cached-rec-001',
      proposalApproach: 'cached-approach',
      confidence: 78,
      generatedAt: '2024-01-15T10:00:00Z',
      cacheSource: 'similar-historical-deal',
    };

    const result = await explainRecommendationReasoning(
      newDealData,
      mockAIEngine,
      mockCachedRecommendation
    );

    expect(result).toEqual({
      status: 'fallback',
      message: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      cachedRecommendation: mockCachedRecommendation,
      errorDetails: {
        relevanceScore: 101,
        externalApiCallFailed: true,
        errorReason: 'Pattern relevance score exceeds maximum threshold',
      },
      internalLog: {
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
        dealId: 'deal-2024-001',
        relevanceScoreExceeded: true,
        relevanceScore: 101,
        maxAllowedScore: 100,
        apiCallFailed: true,
        failureReason: 'Pattern relevance score exceeds maximum threshold',
      },
    });

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealData
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});