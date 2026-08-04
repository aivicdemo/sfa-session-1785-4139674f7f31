import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1476
  test('購買履歴データ品質判定機能 - 購買数量が0のときエラーを返す', () => {
    const invalidPurchaseHistoryData = {
      customerId: 'CUST-001',
      productId: 'PROD-A',
      purchaseDate: '2024-01-15T11:00:00Z',
      purchaseQuantity: 0,
      purchaseAmount: 100000,
    };

    expect(() =>
      evaluatePurchaseHistoryDataQuality(invalidPurchaseHistoryData)
    ).toThrow(/購買数量/);
  });
});