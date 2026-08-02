import { normalizeCustomerPhoneNumber } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-147
  test('電話番号のハイフン除去正規化により、ハイフンが削除される', () => {
    const input_phone_number = '09-1234-5678';
    const result = normalizeCustomerPhoneNumber(input_phone_number);
    expect(result).toBe('09012345678');
  });
});