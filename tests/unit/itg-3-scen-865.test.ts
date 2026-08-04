import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-865: 成功パターンマッチスコアが入力されないとき信頼度スコア計算が成立しない', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
    };

    const customerInfo = {
      industry: 'IT',
      companySize: '中堅',
    };

    const dealConditions = {
      budget: 5000000,
      implementationPeriod: 3,
    };

    const systemLogs: string[] = [];
    const mockLogger = {
      error: jest.fn((message: string) => {
        systemLogs.push(message);
      }),
    };

    const result = calculateRecommendationConfidenceScore(
      customerInfo,
      dealConditions,
      mockAIEngine,
      mockLogger
    );

    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/成功パターンマッチスコアが入力されていません/)
    );
    expect(systemLogs[0]).toMatch(/信頼度スコアの計算処理を中断します/);
    expect(Number.isNaN(result as any)).toBe(false);
    expect(Number.isFinite(result as any)).toBe(false);
  });
});