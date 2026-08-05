import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeAndReportSalesPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-645: 月末を含む期間のデータ集計の正確性検証
  it('分析対象期間が月末を含むとき、月末データが正確に集計される', () => {
    // Arrange: テスト用データを準備
    const sales_staff_id = 'SALES_A001';
    const analysis_start_date = new Date('2024-03-28T00:00:00Z');
    const analysis_end_date = new Date('2024-03-31T23:59:59Z');

    // 営業案件データ（5件、各100万円）
    const deals = [
      {
        deal_id: 'DEAL_001',
        sales_staff_id,
        deal_amount: 1000000,
        deal_status: 'closed_won',
        closed_date: new Date('2024-03-28T10:30:00Z'),
        customer_id: 'CUST_001'
      },
      {
        deal_id: 'DEAL_002',
        sales_staff_id,
        deal_amount: 1000000,
        deal_status: 'closed_won',
        closed_date: new Date('2024-03-29T14:15:00Z'),
        customer_id: 'CUST_002'
      },
      {
        deal_id: 'DEAL_003',
        sales_staff_id,
        deal_amount: 1000000,
        deal_status: 'closed_won',
        closed_date: new Date('2024-03-30T09:45:00Z'),
        customer_id: 'CUST_003'
      },
      {
        deal_id: 'DEAL_004',
        sales_staff_id,
        deal_amount: 1000000,
        deal_status: 'closed_won',
        closed_date: new Date('2024-03-31T11:20:00Z'),
        customer_id: 'CUST_004'
      },
      {
        deal_id: 'DEAL_005',
        sales_staff_id,
        deal_amount: 1000000,
        deal_status: 'closed_won',
        closed_date: new Date('2024-03-31T16:00:00Z'),
        customer_id: 'CUST_005'
      }
    ];

    // 営業活動記録（訪問3件、電話接触4件）
    const sales_activities = [
      {
        activity_id: 'ACT_001',
        sales_staff_id,
        activity_type: 'visit',
        activity_datetime: new Date('2024-03-28T08:00:00Z'),
        customer_id: 'CUST_001'
      },
      {
        activity_id: 'ACT_002',
        sales_staff_id,
        activity_type: 'visit',
        activity_datetime: new Date('2024-03-29T08:30:00Z'),
        customer_id: 'CUST_002'
      },
      {
        activity_id: 'ACT_003',
        sales_staff_id,
        activity_type: 'visit',
        activity_datetime: new Date('2024-03-30T10:00:00Z'),
        customer_id: 'CUST_003'
      },
      {
        activity_id: 'ACT_004',
        sales_staff_id,
        activity_type: 'phone_call',
        activity_datetime: new Date('2024-03-28T15:30:00Z'),
        customer_id: 'CUST_004'
      },
      {
        activity_id: 'ACT_005',
        sales_staff_id,
        activity_type: 'phone_call',
        activity_datetime: new Date('2024-03-29T16:00:00Z'),
        customer_id: 'CUST_002'
      },
      {
        activity_id: 'ACT_006',
        sales_staff_id,
        activity_type: 'phone_call',
        activity_datetime: new Date('2024-03-30T14:15:00Z'),
        customer_id: 'CUST_003'
      },
      {
        activity_id: 'ACT_007',
        sales_staff_id,
        activity_type: 'phone_call',
        activity_datetime: new Date('2024-03-31T13:45:00Z'),
        customer_id: 'CUST_005'
      }
    ];

    // Act: 分析機能を実行
    const report = analyzeAndReportSalesPerformance({
      sales_staff_id,
      analysis_start_date,
      analysis_end_date,
      deals,
      sales_activities
    });

    // Assert: 集計結果を検証
    expect(report.analysis_period_start).toEqual(new Date('2024-03-28T00:00:00Z'));
    expect(report.analysis_period_end).toEqual(new Date('2024-03-31T23:59:59Z'));
    expect(report.closed_deal_count).toBe(5);
    expect(report.total_sales_amount).toBe(5000000);
    expect(report.visit_count).toBe(3);
    expect(report.phone_call_count).toBe(4);
    expect(report.sales_staff_id).toBe('SALES_A001');

    // 月末日（3月31日）のデータが重複計上されていないことを確認
    const deals_on_march_31 = report.deals_in_period.filter(
      (deal) => deal.closed_date.getDate() === 31
    );
    expect(deals_on_march_31.length).toBe(2);

    const activities_on_march_31 = report.activities_in_period.filter(
      (activity) => activity.activity_datetime.getDate() === 31
    );
    expect(activities_on_march_31.length).toBe(1);

    // 期間内全データが正確に1回ずつ集計されていることを確認
    expect(report.deals_in_period.length).toBe(5);
    expect(report.activities_in_period.length).toBe(7);

    // 売上合計の計算確認（5件 × 100万円 = 500万円）
    const sum_of_amounts = report.deals_in_period.reduce(
      (sum, deal) => sum + deal.deal_amount,
      0
    );
    expect(sum_of_amounts).toBe(5000000);
  });
});