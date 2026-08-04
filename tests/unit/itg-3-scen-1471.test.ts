import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1471
  test('購買金額が欠けているときエラーを返す', () => {
    const purchaseHistory = {
      customerId: 'CUST001',
      productId: 'PROD123',
      purchaseDateTime: '2026-01-15T10:30:00Z',
      purchaseQuantity: 5,
      purchaseAmount: null,
    };

    expect(() => {
      evaluatePurchaseHistoryDataQuality(purchaseHistory);
    }).toThrow(/purchaseAmount/);
  });
});