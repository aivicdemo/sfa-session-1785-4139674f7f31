import { recordPurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-971
  test('同じ顧客の購買結果を2回記録した場合に両方が正しく記録される', () => {
    const customer_id = 'CUST-001';
    const product_a = '製品A';
    const amount_a = 10000;
    const product_b = '製品B';
    const amount_b = 5000;

    const first_record = {
      customer_id,
      product: product_a,
      amount: amount_a,
      recorded_at: new Date('2024-01-15T10:00:00Z'),
    };

    const second_record = {
      customer_id,
      product: product_b,
      amount: amount_b,
      recorded_at: new Date('2024-01-15T11:00:00Z'),
    };

    const first_result = recordPurchaseResult(first_record);
    expect(first_result).toEqual({
      success: true,
      purchase_id: expect.any(String),
      customer_id,
      product: product_a,
      amount: amount_a,
    });

    const second_result = recordPurchaseResult(second_record);
    expect(second_result).toEqual({
      success: true,
      purchase_id: expect.any(String),
      customer_id,
      product: product_b,
      amount: amount_b,
    });

    const purchase_history = [first_result, second_result];
    expect(purchase_history).toHaveLength(2);
    expect(purchase_history[0]).toMatchObject({
      customer_id,
      product: product_a,
      amount: amount_a,
    });
    expect(purchase_history[1]).toMatchObject({
      customer_id,
      product: product_b,
      amount: amount_b,
    });
    expect(purchase_history[0].purchase_id).not.toBe(purchase_history[1].purchase_id);
  });
});