import { calculateAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 推論精度検証', () => {
  // SCEN-383: [edge] 推論精度検証機能 - 検証対象の推奨履歴が複数件のとき、全件を集計対象に含めて精度計測を実行
  test('複数件の推奨履歴全件を対象に精度計測を実行し、件数と精度スコアを正確に算出', () => {
    // 事前登録: テスト用推奨履歴データベースに3件の推奨記録を登録
    const recommendation_1 = {
      recommendationId: 'REC-001',
      dealCondition: {
        customerId: 'CUST-A',
        industryType: 'IT',
        companySize: 'large',
        budget: 5000000,
      },
      recommendedContent: {
        approachStrategy: 'Value-based selling',
        proposalTiming: '2024-02-15',
        followUpAction: 'Executive presentation',
      },
      actualResult: {
        isContracted: true,
        contractAmount: 4800000,
        contractDate: '2024-03-10',
      },
      generatedAt: '2024-02-01T10:00:00Z',
    };

    const recommendation_2 = {
      recommendationId: 'REC-002',
      dealCondition: {
        customerId: 'CUST-B',
        industryType: 'Manufacturing',
        companySize: 'medium',
        budget: 2500000,
      },
      recommendedContent: {
        approachStrategy: 'Solution-oriented pitch',
        proposalTiming: '2024-02-20',
        followUpAction: 'Technical deep-dive',
      },
      actualResult: {
        isContracted: false,
        contractAmount: 0,
        contractDate: null,
      },
      generatedAt: '2024-02-02T11:30:00Z',
    };

    const recommendation_3 = {
      recommendationId: 'REC-003',
      dealCondition: {
        customerId: 'CUST-C',
        industryType: 'Finance',
        companySize: 'large',
        budget: 8000000,
      },
      recommendedContent: {
        approachStrategy: 'ROI-focused proposal',
        proposalTiming: '2024-02-18',
        followUpAction: 'CFO engagement',
      },
      actualResult: {
        isContracted: true,
        contractAmount: 7500000,
        contractDate: '2024-03-05',
      },
      generatedAt: '2024-02-03T14:00:00Z',
    };

    const recommendationHistories = [recommendation_1, recommendation_2, recommendation_3];

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((recommendation) => {
        // 各推奨に対して0～1の関連度スコアを返す
        if (recommendation.recommendationId === 'REC-001') {
          return 0.95; // 実績あり、高精度
        } else if (recommendation.recommendationId === 'REC-002') {
          return 0.45; // 実績なし、低精度
        } else if (recommendation.recommendationId === 'REC-003') {
          return 0.92; // 実績あり、高精度
        }
        return 0.0;
      }),
    };

    // 精度検証機能の主メソッドを呼び出し
    const accuracyResult = calculateAccuracy(recommendationHistories, mockAIEngine);

    // 返却される精度計測結果を検証
    // totalProcessedCount が事前登録した推奨履歴件数と一致（3件）
    expect(accuracyResult.totalProcessedCount).toBe(3);

    // successCount は成約した推奨（REC-001, REC-003）で、スコア > 0.7 のため2件
    expect(accuracyResult.successCount).toBe(2);

    // failureCount は非成約または低スコア（REC-002）で1件
    expect(accuracyResult.failureCount).toBe(1);

    // successCount と failureCount の合計が totalProcessedCount と等しい
    expect(accuracyResult.successCount + accuracyResult.failureCount).toBe(
      accuracyResult.totalProcessedCount
    );

    // accuracyScore が 0～1 の範囲内の小数値として算出
    // 期待値: (2 * 0.95 + 1 * 0.45) / 3 ≈ 0.7833... ≈ 0.78
    expect(accuracyResult.accuracyScore).toBeGreaterThanOrEqual(0);
    expect(accuracyResult.accuracyScore).toBeLessThanOrEqual(1);
    expect(accuracyResult.accuracyScore).toBeCloseTo(
      (2 * 0.95 + 0.45) / 3,
      2
    );

    // ログ出力に登録済み全件の推奨IDが処理対象として記録される
    expect(accuracyResult.processedRecommendationIds).toContain('REC-001');
    expect(accuracyResult.processedRecommendationIds).toContain('REC-002');
    expect(accuracyResult.processedRecommendationIds).toContain('REC-003');
    expect(accuracyResult.processedRecommendationIds.length).toBe(3);

    // AIエンジンの evaluatePatternRelevance が各推奨に対して呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      recommendation_1
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      recommendation_2
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      recommendation_3
    );
  });
});