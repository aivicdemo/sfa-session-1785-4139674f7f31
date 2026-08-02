import { validatePurchaseHistory } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-902
  test('購買履歴の購買日付が空のとき不整合を検出する', () => {
    const input = {
      customerId: 'CUST-001',
      productId: 'PROD-A',
      purchaseDate: ''
    };

    expect(() => validatePurchaseHistory(input)).toThrow(/購買日付/);
  });
});