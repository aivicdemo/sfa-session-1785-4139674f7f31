import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-866
  test('正規化対象の顧客データが1件のとき、正規化結果が1件で返される', () => {
    const input_customers = [
      {
        customer_id: 'C001',
        customer_name: '株式会社 テスト',
        address: '東京都渋谷区',
      },
    ];

    const result = normalizeCustomerData(input_customers);

    expect(result).toHaveLength(1);
    expect(result[0].customer_id).toBe('C001');
    expect(result[0].customer_name).toBe('株式会社テスト');
    expect(result[0].address).toBe('東京都渋谷区');
    expect(result.length).toBe(input_customers.length);
  });
});