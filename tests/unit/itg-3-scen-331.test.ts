import { calculateAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-331: [edge] 推奨精度検証機能 - 成功した商談の推奨ケースがちょうど100件の場合、精度計測に全件が含まれる
  test('成功商談が正確に100件の場合、全100件が精度計測対象に含まれる', () => {
    // テスト用データベース準備: 成功フラグ=true の商談レコード 100 件
    const successfulDealIds = Array.from({ length: 100 }, (_, i) => `deal_${i + 1}`);
    const successfulDeals = successfulDealIds.map(dealId => ({
      id: dealId,
      status: 'success',
      customerId: `customer_${Math.floor(Math.random() * 10) + 1}`,
      amount: Math.floor(Math.random() * 1000000) + 100000,
      createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
    }));

    // AIRecommendationEngine のスタブ: 各商談に対して推奨ケースを 1 件ずつ生成
    const mockAIEngine = {
      generateRecommendation: jest.fn(async (deal) => ({
        dealId: deal.id,
        recommendationContent: `Recommendation for ${deal.id}`,
        confidence: 85 + Math.random() * 10,
        timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
      })),
    };

    // 推奨ケースの生成（合計 100 件）
    const recommendationCases = successfulDeals.map(deal => ({
      dealId: deal.id,
      recommendationContent: `Recommendation for ${deal.id}`,
      confidence: 85 + Math.random() * 10,
      correctnessFlag: Math.random() > 0.05, // 正解率 95% を想定
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    }));

    // 成功商談フィルター条件を指定
    const filterCondition = {
      successFlag: true,
      fromDate: new Date('2024-01-01T00:00:00Z').toISOString(),
      toDate: new Date('2024-12-31T23:59:59Z').toISOString(),
    };

    // 精度計測ロジックの実行
    const accuracyResult = calculateAccuracy({
      successfulDeals,
      recommendationCases,
      filterCondition,
      aiEngine: mockAIEngine,
    });

    // 計測対象となった推奨ケースの件数をアサーション
    expect(accuracyResult.measuredCaseCount).toBe(100);

    // 精度計算結果が 100 件全体に基づいた値になっていることを検証
    const correctCount = recommendationCases.filter(rc => rc.correctnessFlag).length;
    const expectedAccuracyScore = Math.round((correctCount / 100) * 100);
    expect(accuracyResult.accuracyScore).toBe(expectedAccuracyScore);

    // ページネーション・バッチ処理による件数脱落がないことを確認
    expect(accuracyResult.totalProcessedCount).toBe(100);
    expect(accuracyResult.processedCaseIds.length).toBe(100);
  });
});