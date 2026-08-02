import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-395
  test('顧客名の前後の空白を除去する正規化ルールが適用される', () => {
    const input_customer_name = '  太郎商事  ';
    const result = detectDuplicateCustomers({
      customer_name: input_customer_name,
    });

    expect(result.normalized_customer_name).toBe('太郎商事');
  });
});