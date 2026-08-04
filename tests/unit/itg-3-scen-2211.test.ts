import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2211
  test('顧客対応の接触タイミングが成功パターンより極端に早い場合、タイミング乖離の最大値が適用される', () => {
    // Setup: 成功パターンの標準接触タイミング = 初回接触から30日後
    const successPatternContactTiming = 30;

    // 新規案件: 初回接触から2日後に2回目接触（成功パターンより28日早い）
    const actualContactTiming = 2;
    const timingDeviationDays = successPatternContactTiming - actualContactTiming;

    // AIRecommendationEngine のスタブ設定
    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patterns: [
          {
            patternId: 'pattern-001',
            contactTimingStandardDays: successPatternContactTiming,
            contactTimingDeviationDays: 0,
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 45,
        timingDeviation: {
          deviationDays: timingDeviationDays,
          isEarlyContact: true,
          maxDeviation: timingDeviationDays,
        },
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 入力パラメータ
    const input = {
      customerId: 'cust-001',
      customerName: 'Example Corp',
      industry: 'Manufacturing',
      dealConditions: {
        initialContactDate: new Date('2024-01-15T10:00:00Z'),
        secondContactDate: new Date('2024-01-17T14:00:00Z'),
      },
      successPatternTimingDays: successPatternContactTiming,
      aiEngine: aiRecommendationEngineStub,
    };

    // 実行
    const result = evaluatePatternRelevance(input);

    // 期待結果: タイミング乖離の最大値が28日として適用される
    expect(result.timingDeviation.maxDeviation).toBe(28);
    expect(result.timingDeviation.isEarlyContact).toBe(true);
    expect(result.warningMessage).toContain('標準パターンより28日早い接触が検出されました');
    expect(result.warningMessage).toContain('フォローアップのタイミングを調整してください');
    expect(result.relevanceScore).toBe(45);
  });
});