import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ正規化機能 - 空の顧客名ハンドリング', () => {
  // SCEN-871
  test('正規化対象の顧客名が空のとき、処理は失敗する', () => {
    const invalidCustomer = {
      customer_id: 'CUST-001',
      customer_name: '',
      address: '東京都渋谷区',
      phone: '03-1234-5678',
      email: 'customer@example.com',
    };

    expect(() => normalizeCustomerData(invalidCustomer)).toThrow(/顧客名/);
  });
});