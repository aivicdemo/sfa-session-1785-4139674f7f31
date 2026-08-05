import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeTeamSalesQualityMonthly } from '../../src/logic/it-1-br-2-1-1';

describe('IT-1-BR-2-1-1: Team Sales Quality Monthly Analysis - Month-End Boundary Classification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-913: チーム営業品質月次分析機能 - 月末日が営業活動ログの記録日時の区切りとして正しく分類される
  test('should correctly classify sales activity logs by month with month-end boundary', () => {
    const sales_activity_logs = [
      {
        log_id: 'log_001',
        recorded_at: new Date('2024-01-31T23:59:59Z'),
        sales_rep_id: 'rep_001',
        activity_type: 'visit',
        duration_minutes: 30,
      },
      {
        log_id: 'log_002',
        recorded_at: new Date('2024-02-01T00:00:00Z'),
        sales_rep_id: 'rep_001',
        activity_type: 'call',
        duration_minutes: 15,
      },
      {
        log_id: 'log_003',
        recorded_at: new Date('2024-02-28T23:59:59Z'),
        sales_rep_id: 'rep_002',
        activity_type: 'email',
        duration_minutes: 10,
      },
      {
        log_id: 'log_004',
        recorded_at: new Date('2024-03-01T00:00:00Z'),
        sales_rep_id: 'rep_002',
        activity_type: 'visit',
        duration_minutes: 45,
      },
      {
        log_id: 'log_005',
        recorded_at: new Date('2024-03-31T23:59:59Z'),
        sales_rep_id: 'rep_001',
        activity_type: 'call',
        duration_minutes: 20,
      },
      {
        log_id: 'log_006',
        recorded_at: new Date('2024-04-01T00:00:00Z'),
        sales_rep_id: 'rep_001',
        activity_type: 'visit',
        duration_minutes: 35,
      },
    ];

    const analysis_period_start = new Date('2024-02-01T00:00:00Z');
    const analysis_period_end = new Date('2024-04-30T23:59:59Z');

    const result = analyzeTeamSalesQualityMonthly({
      sales_activity_logs,
      analysis_period_start,
      analysis_period_end,
    });

    expect(result.monthly_summaries).toBeDefined();
    expect(result.monthly_summaries).toHaveLength(3);

    const february_summary = result.monthly_summaries.find(
      (m) => m.year === 2024 && m.month === 2
    );
    expect(february_summary).toBeDefined();
    expect(february_summary!.log_count).toBe(2);
    expect(february_summary!.log_ids).toEqual(['log_002', 'log_003']);

    const march_summary = result.monthly_summaries.find(
      (m) => m.year === 2024 && m.month === 3
    );
    expect(march_summary).toBeDefined();
    expect(march_summary!.log_count).toBe(2);
    expect(march_summary!.log_ids).toEqual(['log_004', 'log_005']);

    const april_summary = result.monthly_summaries.find(
      (m) => m.year === 2024 && m.month === 4
    );
    expect(april_summary).toBeDefined();
    expect(april_summary!.log_count).toBe(1);
    expect(april_summary!.log_ids).toEqual(['log_006']);
  });
});