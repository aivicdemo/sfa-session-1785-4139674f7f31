import { validateCompleteness } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-591
  test('完全性検証で必須項目がすべて存在する場合、合格と判定される', () => {
    const sales_data = {
      customer_name: '株式会社ABC',
      product_id: 'PROD-001',
      amount: 500000,
      contract_date: '2024-01-15'
    };

    const result = validateCompleteness(sales_data);

    expect(result.status).toBe('PASS');
    expect(result.completeness_score).toBe(100);
    expect(result.validation_messages).toEqual([]);
  });
});