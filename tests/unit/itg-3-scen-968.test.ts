import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-968
  test('[error] 推奨根拠の可視化機能 - explainRecommendationReasoning がタイムアウト時に再試行が実行される', async () => {
    let callCount = 0;
    const callTimestamps: number[] = [];
    const startTime = Date.now();

    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn(async () => {
        callCount++;
        callTimestamps.push(Date.now() - startTime);

        if (callCount === 1) {
          // 初回呼び出し: 30秒以内にタイムアウト例外を返す
          await new Promise((resolve) => setTimeout(resolve, 35000));
          throw new Error('API timeout exceeded 30 seconds');
        } else if (callCount === 2) {
          // 1回目再試行（1秒後）: タイムアウト例外
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error('API timeout exceeded 30 seconds');
        } else if (callCount === 3) {
          // 2回目再試行（2秒後）: タイムアウト例外
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error('API timeout exceeded 30 seconds');
        } else if (callCount === 4) {
          // 3回目再試行（4秒後）: タイムアウト例外
          await new Promise((resolve) => setTimeout(resolve, 100));
          throw new Error('API timeout exceeded 30 seconds');
        }
      }),
    };

    const input = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      dealConditions: {
        industry: 'IT',
        companySize: 'large',
        budget: 500000,
        decisionTimeframe: 'Q2',
      },
      recommendedApproach: 'technical_demo_first',
      aiRecommendationEngine: mockAIRecommendationEngine,
    };

    const result = await explainRecommendationReasoning(input);

    expect(callCount).toBe(4);

    expect(callTimestamps[0]).toBeLessThanOrEqual(100);

    expect(callTimestamps[1]).toBeGreaterThanOrEqual(1000);
    expect(callTimestamps[1]).toBeLessThan(1500);

    expect(callTimestamps[2]).toBeGreaterThanOrEqual(3000);
    expect(callTimestamps[2]).toBeLessThan(3500);

    expect(callTimestamps[3]).toBeGreaterThanOrEqual(7000);
    expect(callTimestamps[3]).toBeLessThan(7500);

    expect(result.status).toBe('fallback');
    expect(result.message).toBe(
      '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します'
    );

    expect(result.fallbackPattern).toBeDefined();
    expect(result.fallbackPattern.patternType).toBe('success_pattern');
    expect(result.fallbackPattern.confidence).toBeGreaterThanOrEqual(0);
    expect(result.fallbackPattern.confidence).toBeLessThanOrEqual(100);

    expect(result.explanationSummary).toBeDefined();
    expect(result.explanationSummary.length).toBeGreaterThan(0);

    expect(result.retryAttempts).toBe(3);
    expect(result.totalAttemptsIncludingInitial).toBe(4);
  });
});