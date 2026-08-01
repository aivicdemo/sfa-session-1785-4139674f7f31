import { generateSalesActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-621
  test('チーム平均成約率が複数担当者から正確に計算される', () => {
    const sales_rep_data = [
      {
        sales_rep_id: 'A',
        sales_rep_name: '営業担当者A',
        total_deals: 20,
        completed_deals: 10,
      },
      {
        sales_rep_id: 'B',
        sales_rep_name: '営業担当者B',
        total_deals: 16,
        completed_deals: 8,
      },
      {
        sales_rep_id: 'C',
        sales_rep_name: '営業担当者C',
        total_deals: 24,
        completed_deals: 12,
      },
    ];

    const result = generateSalesActionPatternAnalysisReport(sales_rep_data);

    expect(result.team_avg_completion_rate).toBe(50.0);
  });
});