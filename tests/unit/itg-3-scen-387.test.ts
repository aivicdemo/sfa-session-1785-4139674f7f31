import { describe, test, expect, jest } from '@jest/globals';
import { calculateMonthlyAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨精度検証 - 月末実行時の当月データ集計', () => {
  test('SCEN-387: 月末実行時に当月データを含めて精度計測', () => {
    // 現在日時を月末（2026年8月31日23:59:59）に設定
    const monthEndDate = new Date('2026-08-31T23:59:59Z');
    const mockGetCurrentDate = jest.fn(() => monthEndDate);

    // テストデータの準備：推奨パターンマスタ
    // 当月（8月）の成功商談10件
    const currentMonthDeals = Array.from({ length: 10 }, (_, i) => ({
      dealId: `DEAL_AUG_${i + 1}`,
      month: 8,
      year: 2026,
      patternRelevanceScore: 70 + Math.random() * 20, // 70-90 の範囲
    }));

    // 前月（7月）の成功商談20件
    const previousMonthDeals = Array.from({ length: 20 }, (_, i) => ({
      dealId: `DEAL_JUL_${i + 1}`,
      month: 7,
      year: 2026,
      patternRelevanceScore: 75 + Math.random() * 20, // 75-95 の範囲
    }));

    // 前々月（6月）の成功商談15件
    const twoMonthsAgoDeals = Array.from({ length: 15 }, (_, i) => ({
      dealId: `DEAL_JUN_${i + 1}`,
      month: 6,
      year: 2026,
      patternRelevanceScore: 72 + Math.random() * 18, // 72-90 の範囲
    }));

    const allDeals = [
      ...currentMonthDeals,
      ...previousMonthDeals,
      ...twoMonthsAgoDeals,
    ];

    // 各商談の精度スコアを計算（平均値 75.5 を目指す）
    // 当月：平均 78, 前月：平均 76, 前々月：平均 74
    const currentMonthScores = currentMonthDeals.map((d) => 78);
    const previousMonthScores = previousMonthDeals.map((d) => 76);
    const twoMonthsAgoScores = twoMonthsAgoDeals.map((d) => 74);

    const allScores = [
      ...currentMonthScores,
      ...previousMonthScores,
      ...twoMonthsAgoScores,
    ];

    // 全体の加重平均を計算
    const expectedAverageScore =
      (10 * 78 + 20 * 76 + 15 * 74) / 45;

    // AIRecommendationEngineのスタブ化
    const aiRecommendationEngineStub = {
      evaluatePatternRelevance: jest.fn((dealData) => {
        const deal = allDeals.find((d) => d.dealId === dealData.dealId);
        if (deal && deal.month === 8) return 78;
        if (deal && deal.month === 7) return 76;
        if (deal && deal.month === 6) return 74;
        return 75;
      }),
    };

    // 精度計測処理の実行（デフォルトで当月含む）
    const result = calculateMonthlyAccuracy(
      {
        targetMonth: undefined, // デフォルト：現在月
        includeLookbackMonths: 2, // 前月・前々月も含める
        getCurrentDate: mockGetCurrentDate,
        deals: allDeals,
      },
      aiRecommendationEngineStub
    );

    // 集計対象の検証
    expect(result.aggregationLog).toEqual({
      currentMonth: 10,
      previousMonth: 20,
      twoMonthsAgo: 15,
    });

    // 精度スコアの検証（全45件の加重平均）
    expect(result.averageAccuracyScore).toBeCloseTo(expectedAverageScore, 1);

    // 集計対象月別内訳の記録確認
    expect(result.aggregationSummary).toMatch(/当月:10件/);
    expect(result.aggregationSummary).toMatch(/前月:20件/);
    expect(result.aggregationSummary).toMatch(/前々月:15件/);

    // 処理結果の完全性検証
    expect(result.totalDealsEvaluated).toBe(45);
    expect(result.verificationExecutedAt).toEqual('2026-08-31T23:59:59Z');
  });
});