import { validatePurchaseHistoryCompleteness } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-889
  test('購買履歴データが複数件のときすべてのレコードに対して完全性検証を実行する', () => {
    const purchase_records = [
      {
        customer_id: 'CUST001',
        purchase_date: '2024-01-15',
        amount: 50000,
        product_category: 'Software'
      },
      {
        customer_id: '',
        purchase_date: '2024-01-20',
        amount: 75000,
        product_category: 'Hardware'
      },
      {
        customer_id: 'CUST003',
        purchase_date: '2024-01-25',
        amount: '',
        product_category: 'Consulting'
      }
    ];

    const validation_results = validatePurchaseHistoryCompleteness(purchase_records);

    expect(validation_results).toEqual([
      {
        record_index: 0,
        customer_id: 'CUST001',
        purchase_date: '2024-01-15',
        amount: 50000,
        product_category: 'Software',
        validation_status: 'OK',
        error_message: null
      },
      {
        record_index: 1,
        customer_id: '',
        purchase_date: '2024-01-20',
        amount: 75000,
        product_category: 'Hardware',
        validation_status: 'ERROR',
        error_message: '顧客ID必須'
      },
      {
        record_index: 2,
        customer_id: 'CUST003',
        purchase_date: '2024-01-25',
        amount: '',
        product_category: 'Consulting',
        validation_status: 'ERROR',
        error_message: '金額必須'
      }
    ]);
    
    expect(validation_results.length).toBe(3);
    expect(validation_results.filter((r: { validation_status: string }) => r.validation_status === 'OK').length).toBe(1);
    expect(validation_results.filter((r: { validation_status: string }) => r.validation_status === 'ERROR').length).toBe(2);
  });
});