import { validatePurchaseHistoryData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-916
  test('購買履歴の購買日付の形式が不正なとき形式エラーを検出する', () => {
    const purchase_history_data = {
      purchase_date: '2024/13/45',
      purchase_amount: 100000,
      product_category: '営業支援ツール',
      customer_id: 'CUST-001',
    };

    const result = validatePurchaseHistoryData(purchase_history_data);

    expect(result.validation_status).toBe('NG');
    expect(result.error_code).toBe('INVALID_DATE_FORMAT');
    expect(result.error_message).toBe('購買日付の形式が不正です（期待形式：YYYY-MM-DD）');
  });
});