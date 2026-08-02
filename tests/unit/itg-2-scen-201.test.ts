import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-201
  test('メールアドレスが空のとき、重複判定がスキップされる', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '山田太郎',
      email: '',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '山田太郎',
      email: '',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区',
      created_at: new Date('2024-01-15T11:00:00Z'),
    };

    const result = detectDuplicateCustomers([recordA, recordB]);

    expect(result.duplicate_pairs).toEqual([]);
    expect(result.total_duplicates_detected).toBe(0);
    expect(result.records_marked_as_independent).toBe(2);
  });
});