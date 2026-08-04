import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-204
  test('[normal] OpenAI APIが応答不可のとき、簡略版の根拠説明が返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error('API timeout after retries')
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationPatterns = [
      {
        patternId: 'PAT-001',
        industry: 'IT',
        successRate: 85,
        standardReason: '顧客規模と予算規模が過去事例と合致したため推奨',
        createdAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        patternId: 'PAT-002',
        industry: 'IT',
        successRate: 72,
        standardReason: '業界トレンドに基づき推奨',
        createdAt: new Date('2024-01-10T10:00:00Z'),
      },
      {
        patternId: 'PAT-003',
        industry: 'Finance',
        successRate: 80,
        standardReason: '顧客課題が標準パターンに合致',
        createdAt: new Date('2024-01-12T10:00:00Z'),
      },
    ];

    const newCaseData = {
      customerName: 'テスト顧客A',
      industry: 'IT',
      budget: '500万円',
      challenge: 'システム導入',
    };

    const result = await explainRecommendationReasoning(
      newCaseData,
      mockAIEngine,
      mockRecommendationPatterns
    );

    expect(result).toEqual({
      patternId: 'PAT-001',
      reasoningText: '顧客規模と予算規模が過去事例と合致したため推奨',
      successRate: 85,
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      isFromCache: true,
      fallbackUsed: true,
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseData
    );
    expect(result.successRate).toBe(85);
    expect(result.patternId).toBe('PAT-001');
    expect(result.reasoningText).toBe(
      '顧客規模と予算規模が過去事例と合致したため推奨'
    );
  });
});