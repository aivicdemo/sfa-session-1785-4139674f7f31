import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1167
  test('類似度が閾値ちょうど100%の場合、重複候補として判定される', () => {
    const recordA = {
      customer_id: 'CUST001',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const recordB = {
      customer_id: 'CUST002',
      name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1234-5678',
    };

    const threshold = 100;

    const result = detectDuplicateCustomers([recordA, recordB], threshold);

    expect(result).toEqual({
      is_duplicate: true,
      similarity_score: 100,
      duplicate_level: '完全一致',
      record_a_id: 'CUST001',
      record_b_id: 'CUST002',
    });
  });
});