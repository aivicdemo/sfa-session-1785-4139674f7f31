import { analyzeActionPatternAndCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-842
  test('行動パターンデータが複数件の場合、全件を集約して分析する', () => {
    const sales_person_id = 'SP001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    const action_pattern_data = [
      {
        record_id: 'AP001',
        sales_person_id: sales_person_id,
        activity_date: new Date('2024-01-05T10:00:00Z'),
        activity_type: 'visit',
        duration_minutes: 45,
        deal_closed: true,
      },
      {
        record_id: 'AP002',
        sales_person_id: sales_person_id,
        activity_date: new Date('2024-01-08T14:00:00Z'),
        activity_type: 'phone_call',
        duration_minutes: 15,
        deal_closed: false,
      },
      {
        record_id: 'AP003',
        sales_person_id: sales_person_id,
        activity_date: new Date('2024-01-12T09:30:00Z'),
        activity_type: 'visit',
        duration_minutes: 50,
        deal_closed: true,
      },
      {
        record_id: 'AP004',
        sales_person_id: sales_person_id,
        activity_date: new Date('2024-01-18T11:00:00Z'),
        activity_type: 'email',
        duration_minutes: 5,
        deal_closed: false,
      },
      {
        record_id: 'AP005',
        sales_person_id: sales_person_id,
        activity_date: new Date('2024-01-25T15:30:00Z'),
        activity_type: 'visit',
        duration_minutes: 55,
        deal_closed: true,
      },
    ];

    const standard_process_values = {
      visit_avg_duration: 40,
      phone_call_avg_duration: 10,
      email_avg_duration: 3,
      target_deal_close_rate: 0.5,
      target_activity_frequency_per_month: 4,
    };

    const result = analyzeActionPatternAndCorrelation({
      sales_person_id,
      analysis_period_start,
      analysis_period_end,
      action_pattern_data,
      standard_process_values,
    });

    // 活動種別別平均所要時間の集約検証
    expect(result.aggregated_metrics.visit_avg_duration).toBe(50);
    expect(result.aggregated_metrics.phone_call_avg_duration).toBe(15);
    expect(result.aggregated_metrics.email_avg_duration).toBe(5);

    // 成約率の集約検証 (3件中3件成約 = 0.6)
    expect(result.aggregated_metrics.deal_close_rate).toBe(0.6);

    // 活動頻度の集約検証 (5件データ = 5回の活動)
    expect(result.aggregated_metrics.activity_frequency).toBe(5);

    // 営業標準書との乖離値の計算検証
    expect(result.deviation_analysis.visit_duration_deviation).toBe(10);
    expect(result.deviation_analysis.deal_close_rate_deviation).toBe(0.1);
    expect(result.deviation_analysis.activity_frequency_deviation).toBe(1);

    // 相関係数の計算検証 (範囲: 0.00～1.00)
    expect(result.correlation_analysis.correlation_coefficient).toBeGreaterThanOrEqual(0);
    expect(result.correlation_analysis.correlation_coefficient).toBeLessThanOrEqual(1);

    // 分析対象データセットの記録検証
    expect(result.analysis_dataset.record_count).toBe(5);
    expect(result.analysis_dataset.record_ids).toEqual([
      'AP001',
      'AP002',
      'AP003',
      'AP004',
      'AP005',
    ]);
    expect(result.analysis_dataset.record_ids.length).toBe(5);

    // 分析対象データセットにタイムスタンプとロジックバージョンが記録されていることを検証
    expect(result.analysis_dataset.analysis_executed_at).toBeDefined();
    expect(typeof result.analysis_dataset.analysis_executed_at).toBe('object');
    expect(result.analysis_dataset.logic_version).toBeDefined();
    expect(typeof result.analysis_dataset.logic_version).toBe('string');

    // 分析対象が正確に5件すべてを含んでいることを最終確認
    expect(result.analysis_dataset.record_ids).toHaveLength(5);
  });
});