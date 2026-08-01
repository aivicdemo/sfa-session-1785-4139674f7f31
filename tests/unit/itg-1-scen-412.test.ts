import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-412: [edge] 乖離度の値が0.0の場合、正確に表示される', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '山田太郎';
    const deviation_value = 0.0;
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    const total_activities = 45;
    const standard_compliance_score = 100.0;
    const contract_rate = 0.35;

    const analysis_input = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
      total_activities: total_activities,
      deviation: deviation_value,
      standard_compliance_score: standard_compliance_score,
      contract_rate: contract_rate
    };

    const generated_report = generateSalesRepBehaviorAnalysisReport(analysis_input);

    expect(generated_report).toBeDefined();
    expect(generated_report.sales_rep_id).toBe(sales_rep_id);
    expect(generated_report.sales_rep_name).toBe(sales_rep_name);
    expect(generated_report.analysis_period_start).toBe(analysis_period_start);
    expect(generated_report.analysis_period_end).toBe(analysis_period_end);
    expect(generated_report.total_activities).toBe(total_activities);
    expect(generated_report.deviation).toBe(0.0);
    expect(typeof generated_report.deviation).toBe('number');
    expect(generated_report.standard_compliance_score).toBe(standard_compliance_score);
    expect(generated_report.contract_rate).toBe(contract_rate);
  });
});