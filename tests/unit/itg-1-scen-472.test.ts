import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-472
  test('営業担当者の営業活動ログが1件の場合、その1件に基づいて行動パターンが分析される', () => {
    const sales_person_id = 'sp-tanaka-001';
    const sales_person_name = '田中太郎';
    const activity_log_id = 'log-20240115-001';
    const visit_datetime = new Date('2024-01-15T10:00:00Z');
    const visit_destination = 'A社';
    const visit_duration_minutes = 60;
    const contract_result = '失注';
    const visit_industry = '製造業';
    const day_of_week = 1; // Monday
    const visit_time_period = '午前';

    const activity_log = {
      id: activity_log_id,
      sales_person_id: sales_person_id,
      visit_datetime: visit_datetime,
      visit_destination: visit_destination,
      visit_duration_minutes: visit_duration_minutes,
      contract_result: contract_result,
      visit_industry: visit_industry,
      visit_period: visit_time_period,
      day_of_week: day_of_week,
    };

    const input_params = {
      sales_person_id: sales_person_id,
      sales_person_name: sales_person_name,
      activity_logs: [activity_log],
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    };

    const report = generateBehaviorPatternAnalysisReport(input_params);

    expect(report).toBeDefined();
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.sales_person_name).toBe(sales_person_name);
    expect(report.analysis_sample_count).toBe(1);
    expect(report.average_visit_duration_minutes).toBe(60);
    expect(report.contract_success_rate_percent).toBe(0);
    expect(report.failed_contract_count).toBe(1);
    expect(report.visit_pattern_description).toBe('平日午前の単独訪問');
    expect(report.visit_pattern_frequency_percent).toBe(100);
    expect(report.primary_visit_industry).toBe('製造業');
    expect(report.primary_visit_destination).toBe('A社');
    expect(Array.isArray(report.visit_pattern_details)).toBe(true);
    expect(report.visit_pattern_details.length).toBeGreaterThan(0);
    expect(report.report_generated_at).toBeDefined();
  });
});