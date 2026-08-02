import { integrateAndRecordPurchaseDecision } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-973
  test('購買確定日時が月末の場合に正しく記録される', () => {
    const purchase_result_input = {
      purchase_decision_date: new Date('2024-01-31T23:59:59Z'),
      customer_id: 'CUST-12345',
      product_id: 'PROD-67890',
      quantity: 5,
      amount: 50000,
    };

    const result = integrateAndRecordPurchaseDecision(purchase_result_input);

    expect(result.recorded_purchase_decision_date).toEqual(
      new Date('2024-01-31T23:59:59Z'),
    );
    expect(result.aggregation_group_key).toBe('202401');
    expect(result.is_month_end).toBe(true);
  });
});