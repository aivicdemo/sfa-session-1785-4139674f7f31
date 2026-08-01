import { calculateSalesRepresentativeMonthlyAggregation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-203: [edge] 営業担当者行動パターン分析・改善指導対象判定機能 - 集計対象の月末である場合、その月の全データが包含される
  test('should include all sales activity data including month-end records when aggregating month-end period', () => {
    const target_month = new Date('2024-01-31T00:00:00Z');
    
    const aggregation_result = calculateSalesRepresentativeMonthlyAggregation({
      target_month: target_month,
      sales_rep_id: 'SR001'
    });

    expect(aggregation_result.aggregation_period_start).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(aggregation_result.aggregation_period_end).toEqual(new Date('2024-01-31T23:59:59Z'));
    
    expect(aggregation_result.total_visits).toBe(15);
    expect(aggregation_result.total_proposals).toBe(8);
    expect(aggregation_result.total_deals_closed).toBe(3);
    
    expect(aggregation_result.included_records_count).toBe(26);
    expect(aggregation_result.month_end_data_included).toBe(true);
    
    const month_end_visit_count = aggregation_result.daily_breakdown.find(
      (day: any) => day.date === '2024-01-31'
    )?.visit_count || 0;
    expect(month_end_visit_count).toBe(2);
    
    const month_end_proposal_count = aggregation_result.daily_breakdown.find(
      (day: any) => day.date === '2024-01-31'
    )?.proposal_count || 0;
    expect(month_end_proposal_count).toBe(1);
    
    const month_end_deal_count = aggregation_result.daily_breakdown.find(
      (day: any) => day.date === '2024-01-31'
    )?.deal_count || 0;
    expect(month_end_deal_count).toBe(1);
  });
});