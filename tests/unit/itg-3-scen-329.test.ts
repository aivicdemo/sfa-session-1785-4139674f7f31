import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  test('SCEN-329: 推奨精度検証機能 - 検証対象の過去推奨履歴が複数件の場合、全件を対象に精度が計測される', () => {
    // 過去推奨履歴テストデータ（3件）
    const recommendation_history_1 = {
      recommendation_id: 'rec_001',
      deal_id: 'deal_123',
      salesperson_id: 'sales_456',
      recommended_content: '提案アプローチA',
      recommended_timing: new Date('2024-01-10T09:00:00Z'),
      actual_result: '提案採用',
      actual_result_timestamp: new Date('2024-01-15T14:30:00Z'),
    };

    const recommendation_history_2 = {
      recommendation_id: 'rec_002',
      deal_id: 'deal_123',
      salesperson_id: 'sales_456',
      recommended_content: '提案アプローチB',
      recommended_timing: new Date('2024-01-12T10:15:00Z'),
      actual_result: '提案採用',
      actual_result_timestamp: new Date('2024-01-17T11:20:00Z'),
    };

    const recommendation_history_3 = {
      recommendation_id: 'rec_003',
      deal_id: 'deal_123',
      salesperson_id: 'sales_456',
      recommended_content: '提案アプローチC',
      recommended_timing: new Date('2024-01-14T13:45:00Z'),
      actual_result: '提案非採用',
      actual_result_timestamp: new Date('2024-01-18T16:00:00Z'),
    };

    const past_recommendations = [
      recommendation_history_1,
      recommendation_history_2,
      recommendation_history_3,
    ];

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => {
        return {
          similar_patterns: [
            {
              pattern_id: 'pattern_A',
              customer_industry: '製造業',
              customer_scale: '大規模',
              success_rate: 0.85,
            },
          ],
          confidence_score: 0.92,
        };
      }),

      evaluatePatternRelevance: jest.fn((pattern_id: string) => {
        // 各推奨の妥当性スコアを返す
        if (pattern_id === 'rec_001') return 0.9; // 推奨1: スコア0.9
        if (pattern_id === 'rec_002') return 0.88; // 推奨2: スコア0.88
        if (pattern_id === 'rec_003') return 0.65; // 推奨3: スコア0.65（提案非採用）
        return 0;
      }),
    };

    // 精度計測実行
    const accuracy_result = evaluateRecommendationAccuracy(
      {
        deal_id: 'deal_123',
        salesperson_id: 'sales_456',
        past_recommendations,
      },
      mockAIEngine
    );

    // 処理対象推奨件数の検証
    expect(accuracy_result.processed_recommendation_count).toBe(3);

    // 精度スコア計算に使用された過去推奨件数の検証
    expect(accuracy_result.recommendations_used_in_calculation).toBe(3);

    // 精度スコアの計算検証
    // 3件の推奨の成功率を統計的に集計：
    // - 実績が推奨と合致した推奨：2件（rec_001, rec_002）
    // - 実績が推奨と合致しない推奨：1件（rec_003）
    // - 平均合致率 = 2/3 ≈ 0.6667
    // - パターン妥当性スコアの平均 = (0.9 + 0.88 + 0.65) / 3 = 0.8100
    // - 精度スコア = 合致率 × パターン妥当性平均 × 100 = 0.6667 × 0.81 × 100 = 54.0027 → 54
    const expected_accuracy_score = 54;
    expect(accuracy_result.accuracy_score).toBe(expected_accuracy_score);

    // AIエンジンのevaluatePatternRelevanceが全推奨に対して呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(1, 'rec_001');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(2, 'rec_002');
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(3, 'rec_003');

    // 検証の根拠データが含まれることを確認
    expect(accuracy_result.matching_rate).toBe(0.6667);
    expect(accuracy_result.pattern_relevance_average).toBe(0.81);
    expect(accuracy_result.recommendation_details).toHaveLength(3);

    // 各推奨の詳細情報が正しく記録されていることを確認
    expect(accuracy_result.recommendation_details[0]).toEqual({
      recommendation_id: 'rec_001',
      pattern_relevance_score: 0.9,
      actual_result: '提案採用',
      is_matched: true,
    });

    expect(accuracy_result.recommendation_details[1]).toEqual({
      recommendation_id: 'rec_002',
      pattern_relevance_score: 0.88,
      actual_result: '提案採用',
      is_matched: true,
    });

    expect(accuracy_result.recommendation_details[2]).toEqual({
      recommendation_id: 'rec_003',
      pattern_relevance_score: 0.65,
      actual_result: '提案非採用',
      is_matched: false,
    });
  });
});