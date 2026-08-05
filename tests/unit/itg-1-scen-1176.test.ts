import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1176
  test('行動パターン分析レポート生成機能 - 営業担当者ごとの行動パターンと成約実績の相関分析が完了し、分析レポートが生成される', () => {
    const analysis_period_days = 90;
    const report_generated_at = new Date('2024-01-15T11:00:00Z');

    const sales_rep_a_behavior = {
      sales_rep_id: 'rep_001',
      sales_rep_name: '営業担当者A',
      visit_count: 15,
      email_count: 28,
      phone_duration_minutes: 120,
      analysis_period_days: analysis_period_days,
    };

    const sales_rep_b_behavior = {
      sales_rep_id: 'rep_002',
      sales_rep_name: '営業担当者B',
      visit_count: 12,
      email_count: 22,
      phone_duration_minutes: 95,
      analysis_period_days: analysis_period_days,
    };

    const sales_rep_c_behavior = {
      sales_rep_id: 'rep_003',
      sales_rep_name: '営業担当者C',
      visit_count: 18,
      email_count: 35,
      phone_duration_minutes: 145,
      analysis_period_days: analysis_period_days,
    };

    const sales_rep_a_results = {
      sales_rep_id: 'rep_001',
      contract_count: 5,
      contract_amount: 2500000,
      contract_rate: 0.33,
      analysis_period_days: analysis_period_days,
    };

    const sales_rep_b_results = {
      sales_rep_id: 'rep_002',
      contract_count: 4,
      contract_amount: 1800000,
      contract_rate: 0.33,
      analysis_period_days: analysis_period_days,
    };

    const sales_rep_c_results = {
      sales_rep_id: 'rep_003',
      contract_count: 7,
      contract_amount: 3500000,
      contract_rate: 0.39,
      analysis_period_days: analysis_period_days,
    };

    const input_data = {
      analysis_period_days: analysis_period_days,
      behavior_data: [sales_rep_a_behavior, sales_rep_b_behavior, sales_rep_c_behavior],
      results_data: [sales_rep_a_results, sales_rep_b_results, sales_rep_c_results],
      report_generated_at: report_generated_at,
    };

    const report = generateSalesRepBehaviorAnalysisReport(input_data);

    expect(report).toBeDefined();
    expect(report.status).toBe('完了');
    expect(report.generated_at).toBe(report_generated_at);
    expect(report.analysis_period_days).toBe(90);

    expect(report.sales_rep_analyses).toHaveLength(3);

    const rep_a_analysis = report.sales_rep_analyses.find(
      (r) => r.sales_rep_id === 'rep_001'
    );
    expect(rep_a_analysis).toBeDefined();
    expect(rep_a_analysis.sales_rep_name).toBe('営業担当者A');
    expect(rep_a_analysis.visit_count).toBe(15);
    expect(rep_a_analysis.email_count).toBe(28);
    expect(rep_a_analysis.phone_duration_minutes).toBe(120);
    expect(rep_a_analysis.contract_count).toBe(5);
    expect(rep_a_analysis.contract_amount).toBe(2500000);
    expect(rep_a_analysis.contract_rate).toBe(0.33);

    expect(rep_a_analysis.correlation_coefficient).toBeGreaterThanOrEqual(0.0);
    expect(rep_a_analysis.correlation_coefficient).toBeLessThanOrEqual(1.0);

    expect(rep_a_analysis.correlation_strength).toBeDefined();
    expect(['強い正の相関', '中程度の正の相関', '弱い正の相関', '相関なし']).toContain(
      rep_a_analysis.correlation_strength
    );

    const rep_b_analysis = report.sales_rep_analyses.find(
      (r) => r.sales_rep_id === 'rep_002'
    );
    expect(rep_b_analysis).toBeDefined();
    expect(rep_b_analysis.sales_rep_name).toBe('営業担当者B');
    expect(rep_b_analysis.visit_count).toBe(12);
    expect(rep_b_analysis.email_count).toBe(22);
    expect(rep_b_analysis.phone_duration_minutes).toBe(95);
    expect(rep_b_analysis.contract_count).toBe(4);
    expect(rep_b_analysis.contract_amount).toBe(1800000);
    expect(rep_b_analysis.contract_rate).toBe(0.33);

    expect(rep_b_analysis.correlation_coefficient).toBeGreaterThanOrEqual(0.0);
    expect(rep_b_analysis.correlation_coefficient).toBeLessThanOrEqual(1.0);

    expect(rep_b_analysis.correlation_strength).toBeDefined();
    expect(['強い正の相関', '中程度の正の相関', '弱い正の相関', '相関なし']).toContain(
      rep_b_analysis.correlation_strength
    );

    const rep_c_analysis = report.sales_rep_analyses.find(
      (r) => r.sales_rep_id === 'rep_003'
    );
    expect(rep_c_analysis).toBeDefined();
    expect(rep_c_analysis.sales_rep_name).toBe('営業担当者C');
    expect(rep_c_analysis.visit_count).toBe(18);
    expect(rep_c_analysis.email_count).toBe(35);
    expect(rep_c_analysis.phone_duration_minutes).toBe(145);
    expect(rep_c_analysis.contract_count).toBe(7);
    expect(rep_c_analysis.contract_amount).toBe(3500000);
    expect(rep_c_analysis.contract_rate).toBe(0.39);

    expect(rep_c_analysis.correlation_coefficient).toBeGreaterThanOrEqual(0.0);
    expect(rep_c_analysis.correlation_coefficient).toBeLessThanOrEqual(1.0);

    expect(rep_c_analysis.correlation_strength).toBeDefined();
    expect(['強い正の相関', '中程度の正の相関', '弱い正の相関', '相関なし']).toContain(
      rep_c_analysis.correlation_strength
    );

    expect(report.report_summary).toBeDefined();
    expect(report.report_summary.total_sales_reps_analyzed).toBe(3);
    expect(report.report_summary.average_correlation_coefficient).toBeGreaterThanOrEqual(0.0);
    expect(report.report_summary.average_correlation_coefficient).toBeLessThanOrEqual(1.0);
  });
});