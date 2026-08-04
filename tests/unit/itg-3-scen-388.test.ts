import { validateRecommendationInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-388: [edge] 推論精度検証機能 - 検証期間の開始日と終了日が同日のとき、当日のデータのみを集計対象に処理
  test('検証期間の開始日と終了日が同日(2026-08-15)のとき、当日データのみを集計対象に限定する', async () => {
    const start_date = new Date('2026-08-15T00:00:00Z');
    const end_date = new Date('2026-08-15T23:59:59Z');

    const sample_past_success_patterns_on_target_date = [
      {
        pattern_id: 'pat_001',
        customer_industry: 'IT',
        customer_scale: 'large',
        recommendation_score: 0.92,
        is_applicable: true,
        created_at: new Date('2026-08-15T10:30:00Z'),
      },
      {
        pattern_id: 'pat_002',
        customer_industry: 'Finance',
        customer_scale: 'medium',
        recommendation_score: 0.87,
        is_applicable: true,
        created_at: new Date('2026-08-15T14:15:00Z'),
      },
      {
        pattern_id: 'pat_003',
        customer_industry: 'Manufacturing',
        customer_scale: 'small',
        recommendation_score: 0.79,
        is_applicable: false,
        created_at: new Date('2026-08-15T16:45:00Z'),
      },
    ];

    const mock_ai_engine = {
      querySuccessPatternsByDateRange: jest.fn().mockResolvedValue(
        sample_past_success_patterns_on_target_date
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 0.86,
        is_valid: true,
      }),
    };

    const result = await validateRecommendationInferenceAccuracy(
      {
        verification_start_date: start_date,
        verification_end_date: end_date,
      },
      mock_ai_engine
    );

    expect(result.aggregated_record_count).toBe(3);
    expect(result.recommendation_scores).toEqual([0.92, 0.87, 0.79]);
    expect(result.average_score).toBe(0.86);
    expect(result.applicable_pattern_count).toBe(2);
    expect(result.verification_date_range_start).toEqual(
      new Date('2026-08-15T00:00:00Z')
    );
    expect(result.verification_date_range_end).toEqual(
      new Date('2026-08-15T23:59:59Z')
    );

    expect(mock_ai_engine.querySuccessPatternsByDateRange).toHaveBeenCalledWith(
      start_date,
      end_date
    );

    const called_dates = sample_past_success_patterns_on_target_date.map(
      (p) => p.created_at.toISOString().split('T')[0]
    );
    expect(called_dates.every((d) => d === '2026-08-15')).toBe(true);
    expect(called_dates).not.toContain('2026-08-14');
    expect(called_dates).not.toContain('2026-08-16');
  });
});