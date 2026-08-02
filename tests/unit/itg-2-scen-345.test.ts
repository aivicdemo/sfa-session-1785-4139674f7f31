import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-345
  test('電話番号が完全一致している場合、重複候補スコアが加算される', () => {
    const existing_customer = {
      customer_id: 'CUST_001',
      name: '山田太郎',
      phone: '09012345678',
      address: '東京都渋谷区',
    };

    const new_candidate = {
      customer_id: 'CUST_002',
      name: '山田太郎',
      phone: '09012345678',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateCustomers(existing_customer, new_candidate);

    expect(result.duplicate_score).toBe(90);
    expect(result.phone_match).toBe(true);
    expect(result.phone_score_added).toBe(20);
  });
});