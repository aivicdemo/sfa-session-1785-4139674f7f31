import { validateCustomerPurchaseData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-895
  test('購買履歴から購買金額フィールドが欠落しているとき不整合エラーを検出する', () => {
    const purchaseHistory = {
      customerId: 'CUST001',
      purchaseDate: '2024-01-15',
      productId: 'PROD123',
      purchaseAmount: undefined,
    };

    expect(() => {
      validateCustomerPurchaseData(purchaseHistory);
    }).toThrow(/購買金額/);
  });
});