import { calculateSalesProcessDeviationCorrelation } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-846
  test('成約率がちょうど0%の場合、相関分析を実行する', () => {
    const sales_rep_id = 'A001';
    const proposal_count = 10;
    const contract_count = 0;
    const target_period_start = '2024-01-01';
    const target_period_end = '2024-01-31';
    const data_quality_score = 0.95;

    const result = calculateSalesProcessDeviationCorrelation({
      sales_rep_id,
      proposal_count,
      contract_count,
      target_period_start,
      target_period_end,
      data_quality_score,
    });

    expect(result.contract_rate).toBe(0.0);
    expect(result.contract_count).toBe(0);
    expect(result.proposal_count).toBe(10);

    expect(result.report.has_contract_rate_zero).toBe(true);
    expect(result.report.contract_rate_text).toBe('成約件数0件、成約率0.0%');

    expect(result.report.correlation_coefficient).toBeNull();
    expect(result.report.correlation_status).toBe('算出不可');

    expect(result.report.dataset.proposal_count).toBe(10);
    expect(result.report.dataset.contract_count).toBe(0);
    expect(result.report.dataset.period_start).toBe('2024-01-01');
    expect(result.report.dataset.period_end).toBe('2024-01-31');

    expect(result.report.calculation_logic_name).toBe('pearson_correlation_with_zero_check');

    expect(result.report.is_verifiable_by_manager).toBe(true);
    expect(result.report.zero_division_error_occurred).toBe(false);

    expect(result.report.analysis_conclusion).toBeDefined();
    expect(typeof result.report.analysis_conclusion).toBe('string');
    expect(result.report.analysis_conclusion.length).toBeGreaterThan(0);
  });
});