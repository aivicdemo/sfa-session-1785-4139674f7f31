import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1129
  test('顧客メールアドレスが正規化ルールに基づいて正規化される', () => {
    const input_customers = [
      {
        customer_id: 'CUST001',
        email: 'John.Doe@EXAMPLE.COM',
      },
      {
        customer_id: 'CUST002',
        email: '  john.doe@example.com  ',
      },
      {
        customer_id: 'CUST003',
        email: 'john.doe+spam@example.com',
      },
    ];

    const result = normalizeCustomerData(input_customers);

    expect(result).toEqual([
      {
        customer_id: 'CUST001',
        email: 'john.doe@example.com',
      },
      {
        customer_id: 'CUST002',
        email: 'john.doe@example.com',
      },
      {
        customer_id: 'CUST003',
        email: 'john.doe@example.com',
      },
    ]);
  });
});