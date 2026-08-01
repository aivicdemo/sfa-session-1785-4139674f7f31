import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-317
  test('成約実績が1件の営業担当者について成約率が正常に計算される', () => {
    const sales_person_id = 'salesperson_001';
    const total_deals = 5;
    const closed_deals = 1;
    const expected_close_rate = 20.0;

    const report = generateSalesPersonBehaviorAnalysisReport({
      sales_person_id,
      total_deals,
      closed_deals,
    });

    expect(report.close_rate).toBe(expected_close_rate);
  });
});