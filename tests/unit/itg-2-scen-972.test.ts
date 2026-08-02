import { consolidatePurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-972
  test('購買結果記録・営業データ統合機能 - 同じ入力で2回実行しても同じ結果が記録される', () => {
    const input_customer_id = 'CUST-001';
    const input_product_code = 'PROD-A';
    const input_purchase_amount = 50000;
    const input_purchase_datetime = '2024-01-15T10:30:00Z';

    const first_result = consolidatePurchaseData({
      customer_id: input_customer_id,
      product_code: input_product_code,
      purchase_amount: input_purchase_amount,
      purchase_datetime: input_purchase_datetime,
    });

    const second_result = consolidatePurchaseData({
      customer_id: input_customer_id,
      product_code: input_product_code,
      purchase_amount: input_purchase_amount,
      purchase_datetime: input_purchase_datetime,
    });

    expect(first_result.record_id).toBe(second_result.record_id);
    expect(first_result.customer_master_ref).toBe(second_result.customer_master_ref);
    expect(first_result.product_master_ref).toBe(second_result.product_master_ref);
    expect(first_result.purchase_amount).toBe(second_result.purchase_amount);
    expect(first_result.purchase_amount).toBe(50000);
    expect(first_result.consolidation_status).toBe(second_result.consolidation_status);
    expect(first_result.consolidation_status).toBe('consolidated');
  });
});