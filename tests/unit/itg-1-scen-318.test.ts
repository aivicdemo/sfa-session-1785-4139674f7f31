import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('行動パターン分析レポート生成機能', () => {
  // SCEN-318
  test('営業担当者ごとの行動パターンデータが複数件の場合に全件がレポートに含まれる', () => {
    const sales_rep_id = 'SR-001-tanaka-taro';
    const sales_rep_name = '田中太郎';
    const target_month = '2024-01';
    const target_year = 2024;

    const behavior_pattern_data_1 = {
      behavior_pattern_id: 'BP-001',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-10T14:30:00Z',
      customer_contact_method: '訪問',
      proposal_content: '新製品A導入提案',
      customer_id: 'CUST-001',
      customer_name: '顧客企業A'
    };

    const behavior_pattern_data_2 = {
      behavior_pattern_id: 'BP-002',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-15T10:00:00Z',
      customer_contact_method: '電話',
      proposal_content: 'サービス拡張プラン提案',
      customer_id: 'CUST-002',
      customer_name: '顧客企業B'
    };

    const behavior_pattern_data_3 = {
      behavior_pattern_id: 'BP-003',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-22T15:45:00Z',
      customer_contact_method: 'メール',
      proposal_content: 'コスト削減方案提案',
      customer_id: 'CUST-003',
      customer_name: '顧客企業C'
    };

    const input_params = {
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      target_period_start: '2024-01-01',
      target_period_end: '2024-01-31',
      behavior_patterns: [
        behavior_pattern_data_1,
        behavior_pattern_data_2,
        behavior_pattern_data_3
      ]
    };

    const generated_report = generateBehaviorPatternAnalysisReport(input_params);

    expect(generated_report).toBeDefined();
    expect(generated_report.sales_rep_id).toBe(sales_rep_id);
    expect(generated_report.sales_rep_name).toBe(sales_rep_name);
    expect(generated_report.report_period_start).toBe('2024-01-01');
    expect(generated_report.report_period_end).toBe('2024-01-31');

    expect(generated_report.behavior_patterns).toBeDefined();
    expect(Array.isArray(generated_report.behavior_patterns)).toBe(true);
    expect(generated_report.behavior_patterns.length).toBe(3);

    expect(generated_report.behavior_patterns[0]).toEqual({
      behavior_pattern_id: 'BP-001',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-10T14:30:00Z',
      customer_contact_method: '訪問',
      proposal_content: '新製品A導入提案',
      customer_id: 'CUST-001',
      customer_name: '顧客企業A'
    });

    expect(generated_report.behavior_patterns[1]).toEqual({
      behavior_pattern_id: 'BP-002',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-15T10:00:00Z',
      customer_contact_method: '電話',
      proposal_content: 'サービス拡張プラン提案',
      customer_id: 'CUST-002',
      customer_name: '顧客企業B'
    });

    expect(generated_report.behavior_patterns[2]).toEqual({
      behavior_pattern_id: 'BP-003',
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      visit_date_time: '2024-01-22T15:45:00Z',
      customer_contact_method: 'メール',
      proposal_content: 'コスト削減方案提案',
      customer_id: 'CUST-003',
      customer_name: '顧客企業C'
    });
  });
});