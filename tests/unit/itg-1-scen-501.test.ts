import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeSalesActivityPatternAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-501: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 標準プロセスからの乖離度が±5%未満の±4.99%の場合に改善優先度が低と判定される
  test('should generate report with low improvement priority when deviation is 4.99 percent', () => {
    const sales_rep_id = 'SR-001';
    const sales_rep_name = 'Tanaka Hanako';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';
    
    const business_process_deviation_percent = 4.99;
    const contact_frequency_score = 78;
    const proposal_success_rate = 82;
    const followup_interval_score = 85;
    const standard_process_compliance_score = 95.01;
    
    const deal_count = 12;
    const deal_amount_total = 4800000;
    const deal_close_rate = 58.3;
    
    const input_data = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_period_start: analysis_period_start,
      analysis_period_end: analysis_period_end,
      behavior_pattern: {
        business_process_deviation_percent: business_process_deviation_percent,
        contact_frequency_score: contact_frequency_score,
        proposal_success_rate: proposal_success_rate,
        followup_interval_score: followup_interval_score,
        standard_process_compliance_score: standard_process_compliance_score,
      },
      deal_results: {
        deal_count: deal_count,
        deal_amount_total: deal_amount_total,
        deal_close_rate: deal_close_rate,
      },
    };

    const report = analyzeSalesActivityPatternAndGenerateReport(input_data);

    expect(report).toBeDefined();
    expect(report.sales_rep_id).toBe(sales_rep_id);
    expect(report.sales_rep_name).toBe(sales_rep_name);
    expect(report.analysis_period_start).toBe(analysis_period_start);
    expect(report.analysis_period_end).toBe(analysis_period_end);

    expect(report.behavior_analysis).toBeDefined();
    expect(report.behavior_analysis.business_process_deviation_percent).toBe(4.99);
    expect(report.behavior_analysis.contact_frequency_score).toBe(78);
    expect(report.behavior_analysis.proposal_success_rate).toBe(82);
    expect(report.behavior_analysis.followup_interval_score).toBe(85);
    expect(report.behavior_analysis.standard_process_compliance_score).toBe(95.01);

    expect(report.deal_analysis).toBeDefined();
    expect(report.deal_analysis.deal_count).toBe(12);
    expect(report.deal_analysis.deal_amount_total).toBe(4800000);
    expect(report.deal_analysis.deal_close_rate).toBe(58.3);

    expect(report.improvement_priority).toBe('低');
    expect(report.improvement_priority_rationale).toContain('乖離度');
    expect(report.improvement_priority_rationale).toContain('4.99');

    expect(report.improvement_priority).not.toBe('中');
    expect(report.improvement_priority).not.toBe('高');

    expect(report.report_generated_at).toBeDefined();
  });
});