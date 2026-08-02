import { normalizeCustomerPhoneNumbers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化 - 電話番号正規化', () => {
  // SCEN-1036
  test('正規化ルールが適用された顧客データの電話番号がハイフンで統一される', () => {
    const input_customers = [
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        phone_number: '09012345678'
      },
      {
        customer_id: 'CUST002',
        customer_name: '鈴木花子',
        phone_number: '090-1234-5678'
      },
      {
        customer_id: 'CUST003',
        customer_name: '佐藤次郎',
        phone_number: '090 1234 5678'
      }
    ];

    const result = normalizeCustomerPhoneNumbers(input_customers);

    expect(result).toEqual([
      {
        customer_id: 'CUST001',
        customer_name: '山田太郎',
        phone_number: '090-1234-5678'
      },
      {
        customer_id: 'CUST002',
        customer_name: '鈴木花子',
        phone_number: '090-1234-5678'
      },
      {
        customer_id: 'CUST003',
        customer_name: '佐藤次郎',
        phone_number: '090-1234-5678'
      }
    ]);

    expect(result[0].phone_number).toBe('090-1234-5678');
    expect(result[1].phone_number).toBe('090-1234-5678');
    expect(result[2].phone_number).toBe('090-1234-5678');
  });
});