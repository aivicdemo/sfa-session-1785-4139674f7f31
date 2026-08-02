import { normalizeCustomerName } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1177
  test('正規化対象の顧客名が大文字混在の場合、小文字に統一される', () => {
    const input_customer_name = 'AbC CoRp InC.';
    const result = normalizeCustomerName(input_customer_name);
    expect(result).toBe('abc corp inc.');
  });
});