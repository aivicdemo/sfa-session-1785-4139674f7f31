import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateTeamMonthlyQualityMetrics } from '../../src/logic/it-1-br-2-1-1';

describe('Team Monthly Sales Quality Analysis - Reverse Order Data', () => {
  test('SCEN-920: Statistical values are calculated correctly regardless of record registration order (newest to oldest)', () => {
    // Setup: Prepare monthly sales data for sales reps A, B, C with reverse chronological order
    const sales_rep_a_records = [
      {
        sales_rep_id: 'A',
        transaction_date: '2024-01-25',
        revenue: 500000,
        deal_count: 2,
        deals_closed: 1,
      },
      {
        sales_rep_id: 'A',
        transaction_date: '2024-01-20',
        revenue: 300000,
        deal_count: 1,
        deals_closed: 1,
      },
      {
        sales_rep_id: 'A',
        transaction_date: '2024-01-10',
        revenue: 200000,
        deal_count: 3,
        deals_closed: 1,
      },
    ];

    const sales_rep_b_records = [
      {
        sales_rep_id: 'B',
        transaction_date: '2024-01-28',
        revenue: 450000,
        deal_count: 2,
        deals_closed: 2,
      },
      {
        sales_rep_id: 'B',
        transaction_date: '2024-01-15',
        revenue: 350000,
        deal_count: 2,
        deals_closed: 1,
      },
      {
        sales_rep_id: 'B',
        transaction_date: '2024-01-05',
        revenue: 150000,
        deal_count: 1,
        deals_closed: 0,
      },
    ];

    const sales_rep_c_records = [
      {
        sales_rep_id: 'C',
        transaction_date: '2024-01-22',
        revenue: 600000,
        deal_count: 2,
        deals_closed: 2,
      },
      {
        sales_rep_id: 'C',
        transaction_date: '2024-01-12',
        revenue: 400000,
        deal_count: 3,
        deals_closed: 2,
      },
      {
        sales_rep_id: 'C',
        transaction_date: '2024-01-02',
        revenue: 100000,
        deal_count: 1,
        deals_closed: 0,
      },
    ];

    const mixed_records = [
      ...sales_rep_a_records,
      ...sales_rep_b_records,
      ...sales_rep_c_records,
    ];

    // Execute: Calculate team monthly quality metrics
    const result = calculateTeamMonthlyQualityMetrics(mixed_records);

    // Verify: Each sales rep's statistics are calculated correctly
    // Sales Rep A: total_revenue = 500000 + 300000 + 200000 = 1000000
    //             total_deals = 2 + 1 + 3 = 6
    //             deals_closed = 1 + 1 + 1 = 3
    //             close_rate = 3 / 6 = 0.5 (50%)
    expect(result).toEqual(
      expect.objectContaining({
        team_metrics: expect.arrayContaining([
          expect.objectContaining({
            sales_rep_id: 'A',
            total_revenue: 1000000,
            total_deal_count: 6,
            total_deals_closed: 3,
            close_rate: 0.5,
          }),
          // Sales Rep B: total_revenue = 450000 + 350000 + 150000 = 950000
          //             total_deals = 2 + 2 + 1 = 5
          //             deals_closed = 2 + 1 + 0 = 3
          //             close_rate = 3 / 5 = 0.6 (60%)
          expect.objectContaining({
            sales_rep_id: 'B',
            total_revenue: 950000,
            total_deal_count: 5,
            total_deals_closed: 3,
            close_rate: 0.6,
          }),
          // Sales Rep C: total_revenue = 600000 + 400000 + 100000 = 1100000
          //             total_deals = 2 + 3 + 1 = 6
          //             deals_closed = 2 + 2 + 0 = 4
          //             close_rate = 4 / 6 ≈ 0.6667 (66.67%)
          expect.objectContaining({
            sales_rep_id: 'C',
            total_revenue: 1100000,
            total_deal_count: 6,
            total_deals_closed: 4,
            close_rate: expect.closeTo(0.6667, 4),
          }),
        ]),
      }),
    );

    // Verify: Team-wide aggregate statistics
    // team_total_revenue = 1000000 + 950000 + 1100000 = 3050000
    // team_total_deals = 6 + 5 + 6 = 17
    // team_total_closed = 3 + 3 + 4 = 10
    // team_close_rate = 10 / 17 ≈ 0.5882 (58.82%)
    expect(result.team_total_revenue).toBe(3050000);
    expect(result.team_total_deal_count).toBe(17);
    expect(result.team_total_deals_closed).toBe(10);
    expect(result.team_close_rate).toEqual(expect.closeTo(0.5882, 4));

    // Verify: Data is aggregated correctly regardless of reverse chronological order
    expect(result.team_metrics).toHaveLength(3);
    expect(result.team_metrics.map((m: any) => m.sales_rep_id)).toEqual(
      expect.arrayContaining(['A', 'B', 'C']),
    );
  });
});