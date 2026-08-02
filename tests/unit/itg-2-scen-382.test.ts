import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-382
  test('顧客名が前後の空白を除いて一致する場合、重複候補に含められ重複スコアが高と判定される', () => {
    const customers = [
      {
        customer_id: 'CUST001',
        customer_name: '  山田太郎  ',
        address: '東京都渋谷区',
        phone: '09012345678',
        email: 'yamada@example.com',
      },
      {
        customer_id: 'CUST002',
        customer_name: '山田太郎',
        address: '東京都渋谷区',
        phone: '09012345679',
        email: 'yamada.taro@example.com',
      },
    ];

    const result = detectDuplicateCustomers(customers);

    expect(result.duplicate_candidates).toHaveLength(1);
    expect(result.duplicate_candidates[0]).toEqual({
      primary_customer_id: 'CUST001',
      duplicate_customer_id: 'CUST002',
      similarity_score: 0.95,
      match_reason: 'customer_name_normalized',
    });
  });
});