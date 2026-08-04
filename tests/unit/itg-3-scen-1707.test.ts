import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能 - 購買履歴複数件対応', () => {
  // SCEN-1707
  test('購買履歴3件の顧客に対して複数パターンマッチングスコアの平均値0.78を計算・返却し、推奨パターンマスタに記録', () => {
    // テストデータ: 購買履歴が3件以上ある顧客
    const customerId = 'C001';
    const purchaseHistories = [
      {
        purchase_date: '2024-01-15',
        product_name: 'システムA導入',
        amount: 500000,
      },
      {
        purchase_date: '2024-06-20',
        product_name: 'システムB追加購入',
        amount: 300000,
      },
      {
        purchase_date: '2024-11-10',
        product_name: 'システムAアップグレード契約',
        amount: 150000,
      },
    ];

    const processingTimestamp = new Date('2024-12-01T10:30:00Z');

    // AIRecommendationEngineスタブ: 複数の成功パターンスコアを返す
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        pattern_scores: [0.92, 0.78, 0.65],
        matched_patterns_count: 3,
      }),
    };

    // 推奨パターンマスタに記録された中間データを保持
    const recommendationPatternMaster: Array<{
      customer_id: string;
      processing_timestamp: Date;
      purchase_history_count: number;
      pattern_scores: number[];
      final_score: number;
    }> = [];

    // 推奨妥当性スコア算出機能の実行
    const result = evaluatePatternRelevance(
      customerId,
      purchaseHistories,
      processingTimestamp,
      mockAIRecommendationEngine,
      recommendationPatternMaster
    );

    // 期待結果検証

    // 1. 算出スコアが複数パターンマッチング結果（0.92, 0.78, 0.65）の平均値であることを確認
    const expectedAverageScore =
      (0.92 + 0.78 + 0.65) / 3; // = 0.783333...
    const expectedRoundedScore = Math.round(expectedAverageScore * 100) / 100; // = 0.78
    expect(result.final_score).toBe(expectedRoundedScore);

    // 2. 返却されたスコアが小数第2位で四捨五入されていることを確認
    expect(result.final_score).toBe(0.78);

    // 3. 外部AIサービス（スタブ）が呼び出されたことを確認
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();

    // 4. 推奨パターンマスタに正確に記録されていることを確認
    expect(recommendationPatternMaster.length).toBe(1);

    const recordedData = recommendationPatternMaster[0];
    expect(recordedData.customer_id).toBe(customerId);
    expect(recordedData.processing_timestamp).toEqual(processingTimestamp);
    expect(recordedData.purchase_history_count).toBe(3);
    expect(recordedData.pattern_scores).toEqual([0.92, 0.78, 0.65]);
    expect(recordedData.final_score).toBe(0.78);

    // 5. 購買履歴が年月昇順で処理されていることを確認
    expect(result.ordered_purchase_histories).toEqual(purchaseHistories);

    // 6. AIRecommendationEngineが実サービスへ通信していないこと
    // (スタブを通じてのみ呼び出されている)
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: customerId,
        purchase_history_count: 3,
      })
    );
  });
});