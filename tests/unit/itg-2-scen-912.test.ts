import { validatePurchaseHistoryInput } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-912
  test('購買履歴の購買金額が無限大のとき異常値として検出する', () => {
    const purchase_history = {
      customer_id: 'CUST001',
      purchase_amount: Infinity,
      purchase_date: '2024-01-15',
      product_id: 'PROD001',
    };

    expect(() => validatePurchaseHistoryInput(purchase_history)).toThrow(/購買金額は有限の数値である必要があります/);
  });
});