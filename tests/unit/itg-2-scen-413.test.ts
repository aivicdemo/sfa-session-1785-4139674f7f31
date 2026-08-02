import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-413
  test('データ品質ルール定義が存在しない場合、検証が実行されずエラーが発生する', () => {
    const sales_data = {
      customer_name: '株式会社ABC',
      revenue_amount: 500000,
      transaction_date: '2024-01-15'
    };

    expect(() => validateSalesData(sales_data, [])).toThrow(/ルール定義/);
  });
});