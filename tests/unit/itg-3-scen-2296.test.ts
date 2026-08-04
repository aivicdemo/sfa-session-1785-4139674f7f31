import { getRecommendation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2296
  test('推奨キャッシュ・フォールバック機能 - 有効期限切れキャッシュからの代替推奨', async () => {
    const now = new Date('2024-01-15T12:00:00Z');
    const cacheExpiryTime = new Date('2024-01-14T12:00:00Z');

    const expiredCacheRecord = {
      recommendationId: 'REC-2296-001',
      customerId: 'CUST-2296',
      dealType: '大型案件',
      industry: '製造業',
      cachedData: {
        approach: '提案パターンA',
        confidence: 0.85,
      },
      cacheExpiryTime: cacheExpiryTime.toISOString(),
      createdAt: new Date('2024-01-14T11:00:00Z').toISOString(),
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockImplementation(
        () => new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('API timeout after 30 seconds')),
            30000
          );
        })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationPatternMasterStub = [
      {
        patternId: 'PAT-001',
        industryType: '製造業',
        dealSizeCategory: '大型案件',
        successRate: 0.78,
        approach: '標準提案パターン',
        confidence: 0.72,
      },
    ];

    const recommendationCacheStub = [expiredCacheRecord];

    const requestParams = {
      customerId: 'CUST-2296',
      dealType: '大型案件',
      industry: '製造業',
    };

    const result = await getRecommendation(
      requestParams,
      aiEngineStub,
      recommendationPatternMasterStub,
      recommendationCacheStub,
      now
    );

    expect(result.isError).toBe(false);
    expect(result.recommendations).toEqual({
      approach: '提案パターンA',
      confidence: 0.85,
      source: 'expired_cache',
    });
    expect(result.warning).toEqual({
      code: 'CACHE_EXPIRED',
      message:
        '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      timestamp: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
      ),
    });
    expect(result.warning.timestamp).toBeDefined();
  });
});