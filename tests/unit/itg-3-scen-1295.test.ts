import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - OpenAI APIタイムアウト時の代替パターン返却', () => {
  // SCEN-1295
  test('OpenAI APIが30秒以上タイムアウトした場合、推奨パターンマスタから統計的に上位のパターンを代替結果として返却する', async () => {
    jest.useFakeTimers();

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.generateRecommendation.mockImplementation(() => {
      callCount++;
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('API call timeout'));
        }, 31000);
      });
    });

    const newDealData = {
      customerName: 'テスト顧客A',
      industry: '製造業',
      budgetScaleYen: 5000000,
      dealStage: 'initial_proposal',
      dealValue: 5000000,
    };

    const recommendationPromise = generateRecommendation(
      newDealData,
      mockAIEngine
    );

    // 1回目の再試行: 1秒後
    jest.advanceTimersByTime(1000);
    await jest.runOnlyPendingTimersAsync();

    // 2回目の再試行: 2秒後
    jest.advanceTimersByTime(2000);
    await jest.runOnlyPendingTimersAsync();

    // 3回目の再試行: 4秒後
    jest.advanceTimersByTime(4000);
    await jest.runOnlyPendingTimersAsync();

    // API呼び出しが完了するまで進める
    jest.advanceTimersByTime(31000);

    const result = await recommendationPromise;

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(callCount).toBe(3);

    expect(result).toEqual({
      recommendedApproach: '新規顧客向けの導入支援プラン',
      implementationPeriodMonths: 3,
      reasoning: '推奨パターンマスタ内の統計的上位パターンから選択',
      isAlternativePattern: true,
      confidence: expect.any(Number),
    });

    expect(result.isAlternativePattern).toBe(true);
    expect(result.reasoning).not.toContain('GPT-4');
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);

    jest.useRealTimers();
  });
});