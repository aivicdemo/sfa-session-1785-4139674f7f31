import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-614
  test('成約率が正確に計算される（成約数÷提案数）', () => {
    const sales_rep_a = {
      sales_rep_id: 'A001',
      sales_rep_name: '営業担当者A',
      proposals: 10,
      concluded_deals: 3,
    };

    const sales_rep_b = {
      sales_rep_id: 'B001',
      sales_rep_name: '営業担当者B',
      proposals: 20,
      concluded_deals: 5,
    };

    const sales_rep_c = {
      sales_rep_id: 'C001',
      sales_rep_name: '営業担当者C',
      proposals: 5,
      concluded_deals: 0,
    };

    const input_data = [sales_rep_a, sales_rep_b, sales_rep_c];

    const report = generateBehaviorPatternAnalysisReport(input_data);

    expect(report).toBeDefined();
    expect(report.length).toBe(3);

    const report_a = report.find((r: any) => r.sales_rep_id === 'A001');
    expect(report_a).toBeDefined();
    expect(report_a.conclusion_rate).toBe(30.0);

    const report_b = report.find((r: any) => r.sales_rep_id === 'B001');
    expect(report_b).toBeDefined();
    expect(report_b.conclusion_rate).toBe(25.0);

    const report_c = report.find((r: any) => r.sales_rep_id === 'C001');
    expect(report_c).toBeDefined();
    expect(report_c.conclusion_rate).toBe(0.0);
  });
});