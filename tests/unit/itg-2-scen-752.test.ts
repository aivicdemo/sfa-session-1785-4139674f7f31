import { calculatePurchaseSignalStrength } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-752
  test('購買シグナル強度算出機能 - 購買履歴データが1件のとき、購買シグナル強度が正しく算出される', () => {
    const customer_id = 'CUST-001';
    const purchase_history = [
      {
        customer_id: customer_id,
        product_id: 'PROD-001',
        purchase_date: '2024-01-15',
        purchase_amount: 50000
      }
    ];

    const result = calculatePurchaseSignalStrength(customer_id, purchase_history);

    expect(result.signal_strength).toBe(0.35);
    expect(result.status).toBe('SUCCESS');
  });
});