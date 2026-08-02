import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-818
  test('同一顧客IDが複数含まれている場合、重複が除外される', () => {
    const duplicateCandidates = [
      {
        customer_id: 'CUST-001',
        customer_name: '顧客A',
        email: 'a1@example.com',
        phone: '090-0001-0001',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST-001',
        customer_name: '顧客A',
        email: 'a2@example.com',
        phone: '090-0001-0002',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST-001',
        customer_name: '顧客A',
        email: 'a3@example.com',
        phone: '090-0001-0003',
        address: '東京都渋谷区',
      },
      {
        customer_id: 'CUST-002',
        customer_name: '顧客B',
        email: 'b1@example.com',
        phone: '090-0002-0001',
        address: '大阪府北区',
      },
      {
        customer_id: 'CUST-002',
        customer_name: '顧客B',
        email: 'b2@example.com',
        phone: '090-0002-0002',
        address: '大阪府北区',
      },
    ];

    const result = detectDuplicateCustomers(duplicateCandidates);

    expect(result.length).toBe(0);
  });
});