import { calculateTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質月次分析機能 - 年度をまたぐデータ分析', () => {
  // SCEN-916
  test('年度をまたぐ3ヶ月間のデータから統計値が正しく算出される', () => {
    const salesDataByMonth = [
      {
        month: '2023-12',
        sales_amount_jpy: 12000000,
        deal_count: 40,
        close_rate_percent: 75,
      },
      {
        month: '2024-01',
        sales_amount_jpy: 15000000,
        deal_count: 50,
        close_rate_percent: 80,
      },
      {
        month: '2024-02',
        sales_amount_jpy: 18000000,
        deal_count: 60,
        close_rate_percent: 85,
      },
    ];

    const result = calculateTeamQualityStatistics(salesDataByMonth);

    expect(result.total_sales_jpy).toBe(45000000);
    expect(result.total_deal_count).toBe(150);
    expect(result.average_sales_jpy).toBe(15000000);
    expect(result.average_close_rate_percent).toBe(80);
    expect(Math.round(result.sales_amount_stddev_jpy * 10) / 10).toBe(288.7);
    expect(result.data_processing_status).toBe('success');
    expect(result.error_message).toBeNull();
  });
});