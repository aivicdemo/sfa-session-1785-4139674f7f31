import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-857
  test('顧客名が欠けている場合、エラーが発生する', () => {
    const invalid_input_null_customer_name = {
      customer_id: 'CUST001',
      customer_name: null,
      email_address: 'test@example.com',
      phone_number: '090-1234-5678',
      company_name: 'Example Corp',
      postal_code: '100-0001',
    };

    expect(() => detectDuplicateCustomers(invalid_input_null_customer_name)).toThrow(/顧客名/);
  });
});