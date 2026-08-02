import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-258
  test('[normal] 顧客データ重複検出機能 - 顧客マスタが1件のとき、重複検出結果が0件である', () => {
    const customer_data = [
      {
        customer_id: 'CUST-001',
        customer_name: 'サンプル商事',
        phone_number: '090-1234-5678',
        email: 'sample@example.com',
        address: '東京都渋谷区1-1-1',
      },
    ];

    const result = detectDuplicateCustomers(customer_data);

    expect(result.duplicate_group_count).toBe(0);
    expect(result.duplicate_pair_count).toBe(0);
  });
});