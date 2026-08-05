import { generateBehaviorAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-502: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 標準プロセスからの乖離度が±5%を超過した±5.01%の場合に改善優先度が高と判定される
  test('標準プロセス乖離度が+5.01%を超過する場合、改善優先度が「高」と判定される', () => {
    const salesperson_id = 'SP-001';
    const salesperson_name = 'Sales Person A';
    const standard_process_hours = 100;
    const actual_process_hours = 105.01;
    const deviation_percentage = ((actual_process_hours - standard_process_hours) / standard_process_hours) * 100;

    const input = {
      salesperson_id,
      salesperson_name,
      standard_process_hours,
      actual_process_hours,
      contact_frequency: 15,
      proposal_count: 8,
      followup_interval_days: 3,
      conversion_count: 2,
      total_deals: 8,
      conversion_rate: 0.25,
      analysis_period_start_date: '2024-01-01',
      analysis_period_end_date: '2024-01-31',
    };

    const report = generateBehaviorAnalysisReport(input);

    expect(report.salesperson_id).toBe('SP-001');
    expect(report.salesperson_name).toBe('Sales Person A');
    expect(report.deviation_percentage).toBe(5.01);
    expect(report.improvement_priority).toBe('high');
    expect(report.conversion_rate).toBe(0.25);
    expect(typeof report.recommendations).toBe('string');
    expect(typeof report.report_generated_at).toBe('string');
    expect(report.analysis_period_start_date).toBe('2024-01-01');
    expect(report.analysis_period_end_date).toBe('2024-01-31');
  });
});