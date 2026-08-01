import { calculateSalesPersonDeviationAnalysis } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-792
  test('対象営業担当者の商談データが1件のとき、その1件に基づいて乖離度を計算する', () => {
    const sales_person_id = 'SP-001';
    const target_amount = 1000000;
    const actual_amount = 850000;
    const target_order_date = new Date('2024-01-31');
    const actual_order_date = new Date('2024-02-14');

    const deal_data = [
      {
        sales_person_id: sales_person_id,
        deal_id: 'DEAL-0001',
        target_amount: target_amount,
        actual_amount: actual_amount,
        target_order_date: target_order_date,
        actual_order_date: actual_order_date,
      },
    ];

    const result = calculateSalesPersonDeviationAnalysis({
      sales_person_id: sales_person_id,
      deals: deal_data,
    });

    const expected_amount_deviation_percent = 15;
    const expected_date_deviation_days = 14;
    const expected_sample_size = 1;

    expect(result.amount_deviation_percent).toBe(expected_amount_deviation_percent);
    expect(result.date_deviation_days).toBe(expected_date_deviation_days);
    expect(result.composite_deviation_score).toBeDefined();
    expect(typeof result.composite_deviation_score).toBe('number');
    expect(result.metadata.sample_size).toBe(expected_sample_size);
  });
});