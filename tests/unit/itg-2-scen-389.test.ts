import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-389
  test('顧客名と電話番号がともに空の場合、重複候補に含められない', () => {
    const customerA = {
      customer_id: 'CUST-001',
      customer_name: null,
      phone_number: null,
      email: 'test-a@example.com',
      address: '東京都渋谷区',
      industry: '製造業',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    const customerB = {
      customer_id: 'CUST-002',
      customer_name: '山田太郎',
      phone_number: '090-1234-5678',
      email: 'test-b@example.com',
      address: '大阪府大阪市',
      industry: '小売業',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    };

    const duplicateCandidates = detectDuplicateCustomers([customerA, customerB]);

    expect(duplicateCandidates).toEqual([]);
  });
});