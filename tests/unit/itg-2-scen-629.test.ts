import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-629
  test('正規化ルール適用により電話番号がハイフン除去形式に統一される', () => {
    const input_phone_with_hyphen = '090-1234-5678';
    const result = applyNormalizationRules({
      phone: input_phone_with_hyphen,
    });
    expect(result.phone).toBe('09012345678');
  });
});