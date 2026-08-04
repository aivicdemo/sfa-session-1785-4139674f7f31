import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1454
  test('顧客IDが空文字列の購買履歴データが不適合項目に含まれて返される', () => {
    const purchase_history_dataset = [
      {
        record_id: '001',
        customer_id: '',
        purchase_date: '2024-01-15',
        product_code: 'PROD-A',
        quantity: 10,
        amount: 50000,
      },
      {
        record_id: '002',
        customer_id: 'CUST-002',
        purchase_date: '2024-01-16',
        product_code: 'PROD-B',
        quantity: 5,
        amount: 25000,
      },
    ];

    const result = validatePurchaseHistoryDataQuality(purchase_history_dataset);

    expect(result.status).toBe('FAILED');
    expect(result.validation_errors).toBeDefined();
    expect(result.validation_errors.length).toBeGreaterThan(0);

    const customer_id_empty_error = result.validation_errors.find(
      (error: { record_id: string; error_code: string; error_message: string }) =>
        error.record_id === '001' && error.error_code === 'CUSTOMER_ID_EMPTY'
    );

    expect(customer_id_empty_error).toBeDefined();
    expect(customer_id_empty_error.error_message).toMatch(/顧客ID/);
    expect(customer_id_empty_error.error_message).toMatch(/空文字列/);

    const failed_records = result.failed_records || [];
    const failed_record_001 = failed_records.find(
      (record: { record_id: string; status: string }) => record.record_id === '001'
    );

    expect(failed_record_001).toBeDefined();
    expect(failed_record_001.status).toBe('FAILED');
  });
});