import { normalizeCustomerName } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-146
  test('顧客名の大文字小文字正規化により、大文字が小文字に統一される', () => {
    const input_customer_name = 'Tanaka Taro';
    const expected_normalized_name = 'tanaka taro';

    const result = normalizeCustomerName(input_customer_name);

    expect(result).toBe(expected_normalized_name);
  });
});