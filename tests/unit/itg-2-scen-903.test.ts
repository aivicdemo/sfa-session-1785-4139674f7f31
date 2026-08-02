import { validatePurchaseHistoryInput } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-903
  test('購買履歴の購買金額が0のとき不整合を検出する', () => {
    const purchaseHistoryData = {
      customerId: 'CUST-001',
      purchaseDate: '2024-01-15',
      productId: 'PROD-ABC',
      purchaseAmount: 0,
      quantity: 1,
      currency: 'JPY'
    };

    const result = validatePurchaseHistoryInput(purchaseHistoryData);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          errorCode: 'PURCHASE_AMOUNT_INVALID',
          message: '購買金額は0より大きい値を入力してください',
          field: 'purchaseAmount'
        })
      ])
    );
  });
});