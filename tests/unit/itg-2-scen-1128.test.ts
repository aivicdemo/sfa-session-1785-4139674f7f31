import { describe, test, expect } from '@jest/globals';
import { normalizeCustomerName } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1128
  test('顧客名が正規化ルールに基づいて正規化される', () => {
    const input_customer_name = '　山田　　太郎　';
    const expected_normalized_name = '山田 太郎';

    const result = normalizeCustomerName(input_customer_name);

    expect(result).toBe(expected_normalized_name);
  });
});