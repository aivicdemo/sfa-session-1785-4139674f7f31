import { validatePurchaseHistoryInput } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客購買検討データ入力検証機能', () => {
  // SCEN-918
  test('購買金額が小数第3位を含むとき端数エラーを検出する', () => {
    const input_purchase_history = {
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15',
      purchase_amount: 1234.567,
      product_category: 'software'
    };

    const result = validatePurchaseHistoryInput(input_purchase_history);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBe('AMOUNT_PRECISION_ERROR');
    expect(result.error_message).toBe('購買金額は小数第2位までの精度のみサポートされています');
  });
});