import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と統合判定機能', () => {
  // SCEN-387
  test('顧客名が空で電話番号が一致する場合、重複候補に含められない', () => {
    const customerA = {
      customer_id: 'cust_001',
      customer_name: '',
      phone_number: '09012345678',
      email: 'a@example.com',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const customerB = {
      customer_id: 'cust_002',
      customer_name: '山田太郎',
      phone_number: '09012345678',
      email: 'b@example.com',
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    const duplicateCandidates = detectDuplicateCustomers([customerA, customerB]);

    const pairExists = duplicateCandidates.some(
      (pair) =>
        (pair.customer_id_1 === 'cust_001' && pair.customer_id_2 === 'cust_002') ||
        (pair.customer_id_1 === 'cust_002' && pair.customer_id_2 === 'cust_001')
    );

    expect(pairExists).toBe(false);
  });
});