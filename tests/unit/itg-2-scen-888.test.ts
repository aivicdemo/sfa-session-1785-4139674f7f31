import { validateDataCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-888
  test('購買履歴データが1件のときデータ完全性チェックを実行する', () => {
    const purchase_record = {
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15',
      product_id: 'PROD-A001',
      amount: 50000,
      status: 'completed'
    };

    const result = validateDataCompleteness([purchase_record]);

    expect(result.check_status).toBe('完全性確認済み');
    expect(result.error_messages).toEqual([]);
    expect(result.checked_record_count).toBe(1);
    expect(result.judgment_result).toBe('合格');
  });
});