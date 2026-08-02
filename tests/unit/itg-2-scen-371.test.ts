import { validateCustomerData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-371
  test('顧客データ入力漏れを検出し、該当件数と問題パターンが返される', () => {
    const testData = [
      { customer_id: 1, customer_name: '', email: 'user1@example.com', phone: '09012345601' },
      { customer_id: 2, customer_name: '', email: 'user2@example.com', phone: '09012345602' },
      { customer_id: 3, customer_name: '', email: 'user3@example.com', phone: '09012345603' },
      { customer_id: 4, customer_name: '', email: 'user4@example.com', phone: '09012345604' },
      { customer_id: 5, customer_name: '', email: 'user5@example.com', phone: '09012345605' },
      { customer_id: 6, customer_name: 'Customer6', email: '', phone: '09012345606' },
      { customer_id: 7, customer_name: 'Customer7', email: '', phone: '09012345607' },
      { customer_id: 8, customer_name: 'Customer8', email: '', phone: '09012345608' },
      { customer_id: 9, customer_name: 'Customer9', email: 'user9@example.com', phone: '' },
      { customer_id: 10, customer_name: 'Customer10', email: 'user10@example.com', phone: '' },
    ];

    const result = validateCustomerData(testData);

    expect(result.total_error_count).toBe(10);
    expect(result.status).toBe('validation_failed');
    expect(result.error_patterns).toEqual([
      { pattern: '顧客名欠落', count: 5 },
      { pattern: 'メールアドレス欠落', count: 3 },
      { pattern: '電話番号欠落', count: 2 },
    ]);
  });
});