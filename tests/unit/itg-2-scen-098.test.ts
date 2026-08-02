import { detectCustomerDuplicate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-098: 顧客名が完全に一致する場合、高確度の重複と判定される', () => {
    const existing_customer = {
      customer_id: 'C001',
      customer_name: '山田太郎',
      address: '東京都渋谷区',
      phone: '090-1111-1111',
      email: 'yamada@example.com',
    };

    const new_customer = {
      customer_id: 'C002',
      customer_name: '山田太郎',
      address: '大阪府大阪市',
      phone: '090-2222-2222',
      email: 'yamada.taro@example.jp',
    };

    const result = detectCustomerDuplicate(existing_customer, new_customer);

    expect(result.duplicate_flag).toBe(true);
    expect(result.confidence_score).toBeGreaterThanOrEqual(0.95);
    expect(result.match_type).toBe('EXACT_NAME_MATCH');
  });
});