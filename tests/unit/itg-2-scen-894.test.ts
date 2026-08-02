import { validateCustomerPurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-894
  test('購買履歴から購買日付フィールドが欠落しているとき不整合エラーを検出する', () => {
    const purchaseHistory = {
      customerId: 'CUST-001',
      purchaseAmount: 150000,
      purchaseDate: null,
      productId: 'PROD-123',
      quantity: 5,
    };

    expect(() => {
      validateCustomerPurchaseData(purchaseHistory);
    }).toThrow(/購買日付/);
  });
});