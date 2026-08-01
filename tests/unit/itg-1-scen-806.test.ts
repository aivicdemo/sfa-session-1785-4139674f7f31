import { analyzeActionPatternAndClassifyDeviation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-806
  test('乖離と成約実績に相関がない場合、その乖離は中立と分類される', () => {
    const sales_person_id = 'SP-001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    const deviation_data = {
      sales_person_id: sales_person_id,
      deviation_type: 'initial_contact_timing',
      standard_action: {
        action_name: 'initial_contact',
        expected_day_offset: 1,
        expected_contact_method: 'email',
      },
      actual_action: {
        action_name: 'initial_contact',
        actual_day_offset: 5,
        actual_contact_method: 'phone',
      },
      deviation_magnitude: 4,
      observation_count: 25,
    };

    const contract_results = {
      sales_person_id: sales_person_id,
      total_deals: 25,
      successful_contracts: 12,
      success_rate: 0.48,
    };

    const correlation_coefficient = 0.03;

    const result = analyzeActionPatternAndClassifyDeviation({
      sales_person_id: sales_person_id,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
      deviation_data: deviation_data,
      contract_results: contract_results,
      correlation_coefficient: correlation_coefficient,
    });

    expect(result.deviation_classification).toBe('Neutral');
    expect(result.improvement_priority_level).toBe('Low');
    expect(result.is_excluded_from_improvement_targets).toBe(true);
    expect(result.correlation_score).toBe(0.03);
    expect(result.analysis_timestamp).toEqual(expect.any(Date));
  });
});