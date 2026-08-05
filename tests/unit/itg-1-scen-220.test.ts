import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  generateSalesActivityPatternReport,
} from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析レポート生成機能', () => {
  // SCEN-220
  test('営業担当者SA001の商談記録から行動パターン分析レポートが生成される', async () => {
    const sales_rep_id = 'SA001';
    const report_start_date = new Date('2024-01-01T00:00:00Z');
    const report_end_date = new Date('2024-03-31T23:59:59Z');

    const deal_records = [
      {
        deal_id: 'DEAL001',
        sales_rep_id: 'SA001',
        customer_id: 'CUST001',
        first_contact_date: new Date('2024-01-05T10:00:00Z'),
        first_proposal_date: new Date('2024-01-12T14:00:00Z'),
        negotiation_start_date: new Date('2024-01-19T09:00:00Z'),
        contract_date: new Date('2024-01-26T15:00:00Z'),
        is_won: true,
        contact_count: 4,
        contact_dates: [
          new Date('2024-01-05T10:00:00Z'),
          new Date('2024-01-08T11:00:00Z'),
          new Date('2024-01-12T14:00:00Z'),
          new Date('2024-01-19T09:00:00Z'),
        ],
      },
      {
        deal_id: 'DEAL002',
        sales_rep_id: 'SA001',
        customer_id: 'CUST002',
        first_contact_date: new Date('2024-01-10T09:00:00Z'),
        first_proposal_date: new Date('2024-01-17T13:00:00Z'),
        negotiation_start_date: new Date('2024-01-24T10:00:00Z'),
        contract_date: new Date('2024-02-02T16:00:00Z'),
        is_won: true,
        contact_count: 4,
        contact_dates: [
          new Date('2024-01-10T09:00:00Z'),
          new Date('2024-01-12T15:00:00Z'),
          new Date('2024-01-17T13:00:00Z'),
          new Date('2024-01-24T10:00:00Z'),
        ],
      },
      {
        deal_id: 'DEAL003',
        sales_rep_id: 'SA001',
        customer_id: 'CUST003',
        first_contact_date: new Date('2024-02-01T10:00:00Z'),
        first_proposal_date: new Date('2024-02-08T11:00:00Z'),
        negotiation_start_date: new Date('2024-02-15T14:00:00Z'),
        contract_date: new Date('2024-02-22T09:00:00Z'),
        is_won: true,
        contact_count: 3,
        contact_dates: [
          new Date('2024-02-01T10:00:00Z'),
          new Date('2024-02-08T11:00:00Z'),
          new Date('2024-02-15T14:00:00Z'),
        ],
      },
      {
        deal_id: 'DEAL004',
        sales_rep_id: 'SA001',
        customer_id: 'CUST004',
        first_contact_date: new Date('2024-02-20T09:00:00Z'),
        first_proposal_date: new Date('2024-02-27T13:00:00Z'),
        negotiation_start_date: new Date('2024-03-05T10:00:00Z'),
        contract_date: null,
        is_won: false,
        contact_count: 3,
        contact_dates: [
          new Date('2024-02-20T09:00:00Z'),
          new Date('2024-02-27T13:00:00Z'),
          new Date('2024-03-05T10:00:00Z'),
        ],
      },
      {
        deal_id: 'DEAL005',
        sales_rep_id: 'SA001',
        customer_id: 'CUST005',
        first_contact_date: new Date('2024-03-08T14:00:00Z'),
        first_proposal_date: new Date('2024-03-15T10:00:00Z'),
        negotiation_start_date: new Date('2024-03-20T09:00:00Z'),
        contract_date: null,
        is_won: false,
        contact_count: 2,
        contact_dates: [
          new Date('2024-03-08T14:00:00Z'),
          new Date('2024-03-15T10:00:00Z'),
        ],
      },
    ];

    const all_contact_dates = deal_records.flatMap((dr) => dr.contact_dates);
    const contact_day_of_weeks: number[] = all_contact_dates.map(
      (cd) => cd.getUTCDay()
    );
    const day_frequency_map: Record<number, number> = {};
    contact_day_of_weeks.forEach((dow) => {
      day_frequency_map[dow] = (day_frequency_map[dow] ?? 0) + 1;
    });
    const most_frequent_day_of_week = Object.entries(day_frequency_map).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const day_names = [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日',
    ];
    const most_frequent_day_name = day_names[parseInt(most_frequent_day_of_week)];

    const won_count = deal_records.filter((dr) => dr.is_won).length;
    const deal_count = deal_records.length;
    const win_rate = Math.round((won_count / deal_count) * 100);

    const cycle_durations_days: number[] = deal_records.map((dr) => {
      const start = dr.first_contact_date;
      const end = dr.contract_date ?? dr.negotiation_start_date;
      const diff_ms = end.getTime() - start.getTime();
      return Math.ceil(diff_ms / (1000 * 60 * 60 * 24));
    });
    const avg_cycle_days = Math.round(
      cycle_durations_days.reduce((a, b) => a + b, 0) / cycle_durations_days.length
    );

    const contact_freq_counts = deal_records.map((dr) => dr.contact_count);
    const avg_contact_count = Math.round(
      contact_freq_counts.reduce((a, b) => a + b, 0) /
        contact_freq_counts.length
    );
    const contact_frequency_pattern =
      avg_contact_count >= 4 ? '週2回以上' : '週1回程度';

    const report = await generateSalesActivityPatternReport({
      sales_rep_id: sales_rep_id,
      report_period_start: report_start_date,
      report_period_end: report_end_date,
      deal_records: deal_records,
    });

    expect(report).toBeDefined();
    expect(report.report_id).toBeDefined();
    expect(report.report_id).toMatch(/^RPT_/);
    expect(report.generated_at).toBeDefined();
    expect(
      report.generated_at.getTime() >=
        new Date('2024-01-01T00:00:00Z').getTime()
    ).toBe(true);
    expect(report.target_sales_rep_id).toBe('SA001');
    expect(report.report_period_start).toEqual(report_start_date);
    expect(report.report_period_end).toEqual(report_end_date);
    expect(report.average_deal_cycle_days).toBe(18);
    expect(report.win_rate_percentage).toBe(60);
    expect(report.contact_frequency_pattern).toBe('週2回以上');
    expect(report.most_frequent_contact_day_of_week).toBe('火曜日');
    expect(report.status).toBe('完了');
  });
});