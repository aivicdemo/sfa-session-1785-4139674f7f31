import { validatePurchaseHistoryCustomerId } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-923
  test('購買履歴の顧客IDが最大許容文字列長を超過するとき長さエラーを検出する', () => {
    const oversized_customer_id = 'C'.repeat(101);
    const purchase_history_data = {
      customer_id: oversized_customer_id,
    };

    const validation_result = validatePurchaseHistoryCustomerId(purchase_history_data);

    expect(validation_result.error_code).toBe('CUSTOMER_ID_LENGTH_EXCEEDED');
    expect(validation_result.error_message).toBe('顧客IDは100文字以内で入力してください');
    expect(validation_result.validation_status).toBe('NG');
  });
});