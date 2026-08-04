import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1474
  test('購買履歴データ品質判定機能 - 購買数量が欠けているときエラーを返す', () => {
    const purchaseHistoryData = {
      customerId: 'CUST-001',
      productId: 'PROD-123',
      purchaseDate: '2024-01-15T11:00:00Z',
      purchaseAmount: 50000,
      purchaseQuantity: undefined,
    };

    expect(() => evaluatePurchaseHistoryDataQuality(purchaseHistoryData)).toThrow(
      /購買数量/
    );
  });
});