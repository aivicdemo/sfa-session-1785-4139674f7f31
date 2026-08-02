import { validatePurchaseHistoryDataCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-922
  test('顧客購買検討データ入力検証機能 - 購買履歴の顧客IDが最大許容文字列長でもデータ完全性検証が実行される', () => {
    const customer_id_max_length = 'A'.repeat(255);
    const purchase_history_data = {
      customer_id: customer_id_max_length,
      purchase_amount: 50000,
      purchase_date: '2024-01-15T10:00:00Z',
      product_category: 'Software',
      purchase_frequency_days: 30,
    };

    const validation_result = validatePurchaseHistoryDataCompleteness(
      purchase_history_data
    );

    expect(validation_result.status).toBe('PASSED');
    expect(validation_result.checksExecuted).toEqual([
      'nullCheck',
      'lengthCheck',
      'formatCheck',
    ]);
    expect(validation_result.processedRecordCount).toBe(1);
    expect(validation_result.validation_errors).toEqual([]);
  });
});