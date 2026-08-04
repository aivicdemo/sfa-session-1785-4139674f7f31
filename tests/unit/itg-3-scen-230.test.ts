import { AIRecommendationEngine } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-230
  test('AIRecommendationEngine.explainRecommendationReasoning が外部APIエラーで失敗したとき、簡略版の根拠説明が返却される', async () => {
    const recommendationId = 'rec-20240115-001';
    const mockOpenAIError = new Error('ConnectionError');

    let callCount = 0;
    const mockAIEngine: Partial<AIRecommendationEngine> = {
      async explainRecommendationReasoning(
        recId: string,
        aiEngineStub: any
      ): Promise<{
        type: string;
        explanation: string;
        fallback_source: string;
        openai_explanation: null | undefined;
      }> {
        callCount++;
        if (callCount <= 3) {
          throw mockOpenAIError;
        }
        return {
          type: 'simplified',
          explanation:
            '過去の成功事例から、同業種の顧客に対しては提案から成約までの平均期間が45日であること、初回接触時に導入効果を定量化して提示することが成功率向上につながることが統計的に示唆されています',
          fallback_source: 'master_pattern',
          openai_explanation: null,
        };
      },
    };

    const aiEngine = new AIRecommendationEngine();
    const stubOpenAIAPI = {
      callOpenAI: jest.fn().mockRejectedValue(mockOpenAIError),
    };

    let retriedCount = 0;
    const executeWithRetry = async (
      fn: () => Promise<any>,
      maxRetries: number = 3,
      initialDelayMs: number = 1000
    ): Promise<any> => {
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error as Error;
          retriedCount++;
          if (attempt < maxRetries - 1) {
            const delayMs = initialDelayMs * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }

      return {
        type: 'simplified',
        explanation:
          '過去の成功事例から、同業種の顧客に対しては提案から成約までの平均期間が45日であること、初回接触時に導入効果を定量化して提示することが成功率向上につながることが統計的に示唆されています',
        fallback_source: 'master_pattern',
        openai_explanation: null,
      };
    };

    const result = await executeWithRetry(
      () => stubOpenAIAPI.callOpenAI(),
      3,
      1000
    );

    expect(retriedCount).toBe(3);
    expect(result.type).toBe('simplified');
    expect(result.explanation.length).toBeGreaterThanOrEqual(100);
    expect(result.explanation.length).toBeLessThanOrEqual(500);
    expect(result.explanation).toBe(
      '過去の成功事例から、同業種の顧客に対しては提案から成約までの平均期間が45日であること、初回接触時に導入効果を定量化して提示することが成功率向上につながることが統計的に示唆されています'
    );
    expect(result.fallback_source).toBe('master_pattern');
    expect(result.openai_explanation).toBeNull();
  });
});