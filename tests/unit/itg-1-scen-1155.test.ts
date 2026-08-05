import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1155
  test('分析対象期間が月末を含むとき正確に集計される', () => {
    const start_date = '2024-01-01';
    const end_date = '2024-01-31';
    const sales_rep_id = 'EMP001';

    const report = generateSalesActivityPatternReport({
      start_date,
      end_date,
      sales_rep_id,
    });

    expect(report.analysis_period_days).toBe(31);
    expect(report.period_start).toBe('2024-01-01');
    expect(report.period_end).toBe('2024-01-31');
    expect(report.sales_rep_id).toBe('EMP001');

    expect(report.total_activities).toBe(5);
    expect(report.customer_contacts).toBe(8);
    expect(report.proposals_submitted).toBe(3);

    expect(report.month_end_activities_included).toBe(true);
    expect(report.activities_on_month_end).toBe(2);

    expect(Array.isArray(report.activity_entries)).toBe(true);
    const month_end_entries = report.activity_entries.filter(
      (entry: { activity_date: string }) => entry.activity_date === '2024-01-31'
    );
    expect(month_end_entries.length).toBe(2);
  });
});