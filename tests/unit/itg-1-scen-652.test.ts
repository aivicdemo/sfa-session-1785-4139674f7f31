import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-652
  test('過去3ヶ月の開始日と終了日の境界の営業活動を正確に計算範囲に含める', () => {
    const fixed_now = new Date('2024-01-15T00:00:00Z');
    const boundary_start = new Date('2023-10-15T00:00:00Z');
    const boundary_end = new Date('2024-01-15T23:59:59Z');
    const outside_before = new Date('2023-10-14T23:59:59Z');
    const outside_after = new Date('2024-01-16T00:00:00Z');

    const sales_activity_records = [
      {
        id: 'activity_001',
        sales_rep_id: 'rep_001',
        activity_date: boundary_start,
        activity_type: 'visit',
        customer_id: 'cust_001',
        notes: 'boundary start date',
      },
      {
        id: 'activity_002',
        sales_rep_id: 'rep_001',
        activity_date: boundary_end,
        activity_type: 'call',
        customer_id: 'cust_002',
        notes: 'boundary end date',
      },
      {
        id: 'activity_003',
        sales_rep_id: 'rep_001',
        activity_date: outside_before,
        activity_type: 'email',
        customer_id: 'cust_003',
        notes: 'outside before',
      },
      {
        id: 'activity_004',
        sales_rep_id: 'rep_001',
        activity_date: outside_after,
        activity_type: 'visit',
        customer_id: 'cust_004',
        notes: 'outside after',
      },
    ];

    const report = generateSalesActivityPatternAnalysisReport({
      current_date: fixed_now,
      sales_activities: sales_activity_records,
      analysis_months: 3,
    });

    expect(report.included_activities).toHaveLength(2);
    expect(report.included_activities[0].id).toBe('activity_001');
    expect(report.included_activities[1].id).toBe('activity_002');
    expect(report.period_start).toEqual(boundary_start);
    expect(report.period_end).toEqual(boundary_end);
    expect(report.excluded_activities_count).toBe(2);
  });
});