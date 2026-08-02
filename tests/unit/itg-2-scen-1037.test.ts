import { normalizeCustomerPostalCode } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 正規化ルール適用', () => {
  // SCEN-1037
  test('正規化ルールが適用された顧客データの郵便番号がハイフンで統一される', () => {
    const input_customer_data = {
      customer_id: 'CUST-001',
      customer_name: '株式会社テスト',
      postal_code: '1234567',
      address: '東京都渋谷区',
      phone: '03-1234-5678'
    };

    const result = normalizeCustomerPostalCode(input_customer_data);

    expect(result.postal_code).toBe('123-4567');
    expect(result.customer_id).toBe('CUST-001');
    expect(result.customer_name).toBe('株式会社テスト');
    expect(result.address).toBe('東京都渋谷区');
    expect(result.phone).toBe('03-1234-5678');
  });
});