import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-1123: 2つの顧客データが完全に同一の場合、重複判定が検出される', () => {
    const customer_a = {
      customer_id: 'CUST001',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
      address: '東京都渋谷区1-1-1',
    };

    const customer_b = {
      customer_id: 'CUST002',
      name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
      address: '東京都渋谷区1-1-1',
    };

    const result = detectDuplicateCustomers([customer_a, customer_b]);

    expect(result.duplicate_status).toBe('EXACT_MATCH');
    expect(result.match_score).toBe(100);
    expect(result.duplicate_customer_ids).toEqual(['CUST001', 'CUST002']);
  });
});