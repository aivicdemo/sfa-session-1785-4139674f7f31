import { normalizeCustomerPhoneNumber } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1130
  test('顧客電話番号が正規化ルールに基づいて正規化される', () => {
    // ハイフン区切り
    expect(normalizeCustomerPhoneNumber('090-1234-5678')).toBe('09012345678');

    // 括弧・ハイフン混合
    expect(normalizeCustomerPhoneNumber('(090)1234-5678')).toBe('09012345678');

    // スペース区切り
    expect(normalizeCustomerPhoneNumber('090 1234 5678')).toBe('09012345678');

    // 区切りなし
    expect(normalizeCustomerPhoneNumber('09012345678')).toBe('09012345678');

    // 先頭の0を+81に置換して正規化
    expect(normalizeCustomerPhoneNumber('0901234567890')).toBe('+818912345678');
  });
});