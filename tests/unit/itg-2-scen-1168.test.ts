import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1168
  test('顧客重複・不整合検出 - 重複候補の類似度が閾値直下99%の場合、重複候補として判定されない', () => {
    const customerA = {
      customer_id: 'CUST-001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
      created_at: new Date('2024-01-15T10:00:00Z'),
      updated_at: new Date('2024-01-15T10:00:00Z'),
    };

    const customerB = {
      customer_id: 'CUST-002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-567X',
      created_at: new Date('2024-01-15T10:05:00Z'),
      updated_at: new Date('2024-01-15T10:05:00Z'),
    };

    const duplicateThreshold = 100;
    const customers = [customerA, customerB];

    const result = detectDuplicateCustomers(customers, duplicateThreshold);

    expect(result.duplicateCandidates).toEqual([]);
    expect(result.similarity_score_customer_a_b).toBe(99);
  });
});