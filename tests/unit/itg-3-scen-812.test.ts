import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-812
  test('[normal] OpenAI API失敗時、キャッシュされた過去推奨が代替表示される', () => {
    const mockCachedRecommendations = [
      {
        id: 'rec_001',
        pattern: '初期導入型提案',
        successRate: 0.82,
        reasoning: '中堅企業への標準提案',
      },
      {
        id: 'rec_002',
        pattern: '段階導入型提案',
        successRate: 0.75,
        reasoning: '大規模企業への段階的導入',
      },
    ];

    const apiCallLog: { attemptNumber: number; delayMs: number; timestamp: string }[] = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        apiCallLog.push({
          attemptNumber: apiCallLog.length + 1,
          delayMs: apiCallLog.length === 0 ? 1000 : apiCallLog.length === 1 ? 2000 : 4000,
          timestamp: new Date('2026-08-01T10:15:30Z').toISOString(),
        });
        throw new Error('OpenAI API unavailable');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const newProjectInput = {
      customerId: 'cust_12345',
      customerName: '株式会社テスト商事',
      industry: '製造業',
      scale: 'medium',
      budget: 5000000,
      keyChallenge: '生産効率化',
      proposedSolution: 'AI導入による自動化',
    };

    const result = generateRecommendationWithFallback(
      newProjectInput,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
      mockCachedRecommendations,
    );

    expect(result.userMessage).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
    );

    expect(result.recommendation).toEqual({
      id: 'rec_001',
      pattern: '初期導入型提案',
      successRate: 0.82,
      reasoning: '中堅企業への標準提案',
    });

    expect(result.reasoningType).toBe('simplified');

    expect(result.simplifiedReasoning).toBe(
      '過去の成功パターンに基づいた推奨です。詳細は営業担当者にお問い合わせください。',
    );

    expect(apiCallLog.length).toBe(3);

    expect(apiCallLog[0]).toEqual({
      attemptNumber: 1,
      delayMs: 1000,
      timestamp: '2026-08-01T10:15:30Z',
    });

    expect(apiCallLog[1]).toEqual({
      attemptNumber: 2,
      delayMs: 2000,
      timestamp: '2026-08-01T10:15:30Z',
    });

    expect(apiCallLog[2]).toEqual({
      attemptNumber: 3,
      delayMs: 4000,
      timestamp: '2026-08-01T10:15:30Z',
    });

    expect(result.apiRetryLog).toEqual(apiCallLog);

    expect(result.fallbackApplied).toBe(true);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(3);
  });
});