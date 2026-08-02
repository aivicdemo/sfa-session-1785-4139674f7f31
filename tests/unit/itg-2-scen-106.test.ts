import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-106
  test('正規化ルールが適用され、大文字小文字が統一される', () => {
    const input_customer_name = 'JoHn DoE';
    const result = normalizeCustomerData({ customer_name: input_customer_name });
    expect(result.normalized_customer_name).toBe('john doe');
  });
});