import { verifyRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-384: 検証周期が週次設定のとき、直近7日間のデータを集計対象として処理', () => {
    // 現在日時を 2026年1月15日（木）12:00:00 に設定
    const current_date = new Date('2026-01-15T12:00:00Z');
    
    // 検証周期を週次に設定
    const verification_config = {
      cycle: 'weekly' as const,
      current_timestamp: current_date,
    };

    // 集計対象期間の期待値
    // 現在日時が2026年1月15日12:00:00のため、直近7日間は
    // 2026年1月9日00:00:00 ～ 2026年1月15日23:59:59
    const expected_start = new Date('2026-01-09T00:00:00Z');
    const expected_end = new Date('2026-01-15T23:59:59Z');

    // サンプル推奨履歴データ：期間内3件、期間外1件
    const sample_recommendations = [
      {
        recommendation_id: 'rec_001',
        created_at: new Date('2026-01-09T08:30:00Z'), // 期間内
        confidence_score: 85,
        recommendation_type: 'proposal_approach',
      },
      {
        recommendation_id: 'rec_002',
        created_at: new Date('2026-01-12T14:15:00Z'), // 期間内
        confidence_score: 92,
        recommendation_type: 'proposal_approach',
      },
      {
        recommendation_id: 'rec_003',
        created_at: new Date('2026-01-15T10:45:00Z'), // 期間内
        confidence_score: 78,
        recommendation_type: 'proposal_approach',
      },
      {
        recommendation_id: 'rec_004',
        created_at: new Date('2026-01-08T16:20:00Z'), // 期間外（前日）
        confidence_score: 88,
        recommendation_type: 'proposal_approach',
      },
    ];

    // AIRecommendationEngineのスタブ定義
    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn((data: any) => ({
        accuracy_score: 87,
        processed_count: data.recommendations.length,
      })),
    };

    // 検証精度検証機能を実行
    const result = verifyRecommendationAccuracy({
      config: verification_config,
      recommendation_data: sample_recommendations,
      ai_engine: ai_engine_stub,
    });

    // 期待値の検証：集計対象期間が正確に計算されているか
    expect(result.aggregation_start_date.toISOString()).toBe(
      expected_start.toISOString()
    );
    expect(result.aggregation_end_date.toISOString()).toBe(
      expected_end.toISOString()
    );

    // 期間内のデータが正確に抽出されているか（3件のみ）
    expect(result.filtered_recommendations.length).toBe(3);

    // 期間内のすべてのレコードが含まれているか
    const filtered_ids = result.filtered_recommendations.map(
      (rec: any) => rec.recommendation_id
    );
    expect(filtered_ids).toContain('rec_001');
    expect(filtered_ids).toContain('rec_002');
    expect(filtered_ids).toContain('rec_003');

    // 期間外のデータが除外されているか
    expect(filtered_ids).not.toContain('rec_004');

    // AIRecommendationEngineへ渡されたデータが期間内のみであることを確認
    expect(ai_engine_stub.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendations: expect.arrayContaining([
          expect.objectContaining({ recommendation_id: 'rec_001' }),
          expect.objectContaining({ recommendation_id: 'rec_002' }),
          expect.objectContaining({ recommendation_id: 'rec_003' }),
        ]),
        period_start: expected_start,
        period_end: expected_end,
      })
    );

    // AIエンジンへ渡されたデータに期間外データが含まれていないか
    const ai_engine_call_args = ai_engine_stub.evaluatePatternRelevance.mock
      .calls[0][0];
    const ai_processed_ids = ai_engine_call_args.recommendations.map(
      (rec: any) => rec.recommendation_id
    );
    expect(ai_processed_ids).not.toContain('rec_004');

    // 検証結果が期待通りの形式で返却されているか
    expect(result).toEqual(
      expect.objectContaining({
        aggregation_start_date: expected_start,
        aggregation_end_date: expected_end,
        filtered_recommendations: expect.arrayContaining([
          expect.objectContaining({
            recommendation_id: expect.any(String),
            created_at: expect.any(Date),
            confidence_score: expect.any(Number),
          }),
        ]),
        accuracy_score: 87,
        verification_cycle: 'weekly',
      })
    );
  });
});