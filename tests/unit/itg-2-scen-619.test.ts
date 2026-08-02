import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-619
  test('電話番号が空値の場合、重複判定対象外となる', () => {
    const customerA = {
      customer_id: 'CUST001',
      customer_name: '顧客A',
      phone_number: '090-1234-5678',
      email: 'user@example.com',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const customerB = {
      customer_id: 'CUST002',
      customer_name: '顧客B',
      phone_number: '',
      email: 'user@example.com',
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    const customers = [customerA, customerB];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicate_candidates).toEqual([]);
    expect(result.excluded_by_empty_phone).toContain('CUST002');
    expect(result.total_candidates_found).toBe(0);
  });
});