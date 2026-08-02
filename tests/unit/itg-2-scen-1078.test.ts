import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1078
  test('重複候補顧客が0件のとき、判定対象がないことが明確に示される', () => {
    const input_customer = {
      customer_id: 'CUST-001',
      customer_name: '山田太郎',
      customer_email: 'yamada@example.com'
    };

    const result = detectDuplicateCustomers([input_customer]);

    expect(result).toEqual({
      duplicate_candidates_count: 0,
      has_duplicates: false,
      merge_button_enabled: false,
      message: '重複候補なし'
    });
  });
});