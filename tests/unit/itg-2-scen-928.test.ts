import { validatePurchaseHistoryDate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-928
  test('購買履歴の日付が月初のとき日付検証が正常に実行される', () => {
    const input_date = '2024-01-01';
    const result = validatePurchaseHistoryDate(input_date);

    expect(result.status).toBe('success');
    expect(result.error_message).toBe('');
    expect(result.validated_date).toBe('2024-01-01');
  });
});