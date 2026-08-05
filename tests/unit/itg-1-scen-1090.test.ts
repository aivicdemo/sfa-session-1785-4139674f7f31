import { selectBehaviorPatternAnalysisMetrics } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1090
  test('行動パターン分析対象指標の自動選定機能 - 同じ指標値が複数営業担当者に並ぶとき全件が分析対象指標リストに含まれる', () => {
    const sales_staff_a_id = 'SSA001';
    const sales_staff_b_id = 'SSB001';
    const sales_staff_c_id = 'SSC001';
    const contract_rate = 0.85;
    const metric_timestamp = new Date('2024-01-15T10:00:00Z');

    const input_metrics = [
      {
        sales_staff_id: sales_staff_a_id,
        contract_rate: contract_rate,
        initial_contact_frequency: 12,
        proposal_success_rate: 0.72,
        followup_interval_days: 5,
        recorded_at: metric_timestamp,
      },
      {
        sales_staff_id: sales_staff_b_id,
        contract_rate: contract_rate,
        initial_contact_frequency: 10,
        proposal_success_rate: 0.68,
        followup_interval_days: 6,
        recorded_at: metric_timestamp,
      },
      {
        sales_staff_id: sales_staff_c_id,
        contract_rate: contract_rate,
        initial_contact_frequency: 14,
        proposal_success_rate: 0.75,
        followup_interval_days: 4,
        recorded_at: metric_timestamp,
      },
    ];

    const process_definition = {
      initial_contact_frequency_min: 10,
      proposal_success_rate_min: 0.60,
      followup_interval_max_days: 7,
      contract_rate_min: 0.70,
    };

    const result = selectBehaviorPatternAnalysisMetrics(
      input_metrics,
      process_definition,
    );

    expect(result).toHaveLength(3);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sales_staff_id: sales_staff_a_id,
          contract_rate: contract_rate,
        }),
        expect.objectContaining({
          sales_staff_id: sales_staff_b_id,
          contract_rate: contract_rate,
        }),
        expect.objectContaining({
          sales_staff_id: sales_staff_c_id,
          contract_rate: contract_rate,
        }),
      ]),
    );

    const staff_ids_in_result = result.map((m) => m.sales_staff_id);
    expect(staff_ids_in_result).toContain(sales_staff_a_id);
    expect(staff_ids_in_result).toContain(sales_staff_b_id);
    expect(staff_ids_in_result).toContain(sales_staff_c_id);
  });
});