import { calculateCorrelationCoefficient } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-844
  test('ステップ実行度がちょうど100%の場合、相関係数を正確に計算する', () => {
    const total_steps = 10;
    const completed_steps = 10;
    const step_execution_degree = (completed_steps / total_steps) * 100;

    expect(step_execution_degree).toBe(100);

    const sales_performance_data = [
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-01T00:00:00Z',
        contract_count: 5,
        contract_amount: 1000000,
        customer_satisfaction_score: 85,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-02T00:00:00Z',
        contract_count: 6,
        contract_amount: 1200000,
        customer_satisfaction_score: 87,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-03T00:00:00Z',
        contract_count: 4,
        contract_amount: 800000,
        customer_satisfaction_score: 82,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-04T00:00:00Z',
        contract_count: 7,
        contract_amount: 1400000,
        customer_satisfaction_score: 88,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-05T00:00:00Z',
        contract_count: 5,
        contract_amount: 1000000,
        customer_satisfaction_score: 85,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-06T00:00:00Z',
        contract_count: 8,
        contract_amount: 1600000,
        customer_satisfaction_score: 89,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-07T00:00:00Z',
        contract_count: 6,
        contract_amount: 1200000,
        customer_satisfaction_score: 86,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-08T00:00:00Z',
        contract_count: 9,
        contract_amount: 1800000,
        customer_satisfaction_score: 90,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-09T00:00:00Z',
        contract_count: 7,
        contract_amount: 1400000,
        customer_satisfaction_score: 87,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-10T00:00:00Z',
        contract_count: 8,
        contract_amount: 1600000,
        customer_satisfaction_score: 88,
      },
    ];

    const step_execution_records = [
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-01T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-02T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-03T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-04T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-05T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-06T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-07T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-08T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-09T00:00:00Z',
        step_execution_degree: 100,
      },
      {
        sales_rep_id: 'REP_A',
        period: '2024-01-10T00:00:00Z',
        step_execution_degree: 100,
      },
    ];

    const result = calculateCorrelationCoefficient(
      step_execution_records,
      sales_performance_data,
      'contract_count'
    );

    expect(result.correlation_coefficient).toBeGreaterThanOrEqual(-1.0);
    expect(result.correlation_coefficient).toBeLessThanOrEqual(1.0);
    expect(result.correlation_coefficient).toBeCloseTo(1.0, 4);

    expect(result.step_execution_record_count).toBe(10);
    expect(result.sales_performance_record_count).toBe(10);
    expect(result.calculation_method).toBe('ピアソンの積率相関係数');
    expect(result.calculation_method).toMatch(/相関係数/);

    expect(result.log_entry).toBeDefined();
    expect(result.log_entry).toMatch(/ステップ実行度100%/);
    expect(result.log_entry).toMatch(/相関係数/);
  });
});