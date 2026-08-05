import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-529: [normal] 失敗パターンのみ存在する場合、成功パターンは空として正確に表現される
  test('失敗パターンのみ存在する場合、成功パターンは空配列として返却される', () => {
    const sales_person_id = 'sales_001';
    const report_period_start = '2024-01-01';
    const report_period_end = '2024-01-31';

    const mock_sales_activity_data = {
      sales_person_id: sales_person_id,
      success_patterns: [],
      failure_patterns: [
        {
          failure_reason: '顧客予算不足',
          occurrence_count: 3,
          affected_deal_count: 3
        },
        {
          failure_reason: '競合他社選定',
          occurrence_count: 2,
          affected_deal_count: 2
        }
      ],
      report_period_start: report_period_start,
      report_period_end: report_period_end,
      total_deals_analyzed: 5,
      success_rate_percentage: 0,
      failure_rate_percentage: 100
    };

    const generated_report = generateSalesPersonAnalysisReport(
      sales_person_id,
      report_period_start,
      report_period_end,
      mock_sales_activity_data
    );

    expect(generated_report).toEqual({
      sales_person_id: 'sales_001',
      report_period_start: '2024-01-01',
      report_period_end: '2024-01-31',
      success_patterns: [],
      failure_patterns: [
        {
          failure_reason: '顧客予算不足',
          occurrence_count: 3,
          affected_deal_count: 3
        },
        {
          failure_reason: '競合他社選定',
          occurrence_count: 2,
          affected_deal_count: 2
        }
      ],
      total_deals_analyzed: 5,
      success_rate_percentage: 0,
      failure_rate_percentage: 100,
      analysis_timestamp: expect.any(String),
      data_quality_score: expect.any(Number)
    });

    expect(Array.isArray(generated_report.success_patterns)).toBe(true);
    expect(generated_report.success_patterns.length).toBe(0);
    expect(generated_report.failure_patterns.length).toBe(2);
    expect(generated_report.success_rate_percentage).toBe(0);
    expect(generated_report.failure_rate_percentage).toBe(100);
  });
});