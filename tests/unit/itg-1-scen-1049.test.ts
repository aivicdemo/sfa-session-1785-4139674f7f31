import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-1049: [edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 実務適用報告の提出日が月末で集計に含まれる
  test('月末日提出の実務適用報告が集計対象期間に含まれ、レポートに正常に集計される', () => {
    const sales_person_id = 'SP001';
    const base_date = new Date('2024-01-31T23:59:59Z');
    const month_start = new Date('2024-01-01T00:00:00Z');
    const month_end = new Date('2024-01-31T23:59:59Z');

    const implementation_reports = [
      {
        report_id: 'RPT001',
        sales_person_id: sales_person_id,
        submission_date: new Date('2024-01-15T10:30:00Z'),
        pattern_type: 'initial_contact',
        execution_status: 'completed',
        pattern_adherence_score: 0.88,
      },
      {
        report_id: 'RPT002',
        sales_person_id: sales_person_id,
        submission_date: new Date('2024-01-31T18:45:00Z'),
        pattern_type: 'proposal_execution',
        execution_status: 'completed',
        pattern_adherence_score: 0.92,
      },
    ];

    const success_pattern_reference = [
      {
        pattern_id: 'PAT001',
        pattern_name: 'initial_contact',
        success_rate: 0.75,
        average_duration_days: 3,
      },
      {
        pattern_id: 'PAT002',
        pattern_name: 'proposal_execution',
        success_rate: 0.82,
        average_duration_days: 7,
      },
    ];

    const result = generateSalesPersonActionPatternAnalysisReport({
      sales_person_id: sales_person_id,
      base_date: base_date,
      month_start: month_start,
      month_end: month_end,
      implementation_reports: implementation_reports,
      success_pattern_reference: success_pattern_reference,
    });

    expect(result.aggregation_period_start).toEqual(month_start);
    expect(result.aggregation_period_end).toEqual(month_end);
    expect(result.total_reports_count).toBe(2);
    expect(result.reports_included_in_aggregation).toBe(2);

    const month_end_report = result.aggregated_patterns.find(
      (pattern: { report_id: string }) => pattern.report_id === 'RPT002',
    );
    expect(month_end_report).toBeDefined();
    expect(month_end_report.submission_date).toEqual(new Date('2024-01-31T18:45:00Z'));
    expect(month_end_report.pattern_type).toBe('proposal_execution');

    expect(result.aggregated_patterns).toHaveLength(2);
    const pattern_count = result.aggregated_patterns.filter(
      (pattern: { sales_person_id: string; submission_date: Date }) =>
        pattern.sales_person_id === sales_person_id &&
        pattern.submission_date >= month_start &&
        pattern.submission_date <= month_end,
    ).length;
    expect(pattern_count).toBe(2);

    const average_adherence_score =
      result.aggregated_patterns.reduce(
        (sum: number, pattern: { pattern_adherence_score: number }) =>
          sum + pattern.pattern_adherence_score,
        0,
      ) / result.aggregated_patterns.length;
    expect(average_adherence_score).toBe(0.9);

    expect(result.report_generation_timestamp).toBeDefined();
    expect(result.report_status).toBe('completed');
  });
});