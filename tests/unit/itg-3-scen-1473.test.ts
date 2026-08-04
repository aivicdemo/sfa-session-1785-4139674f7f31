import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1473
  test('[error] 購買履歴データ品質判定機能 - 購買金額が0のときエラーを返す', () => {
    const invalidPurchaseHistory = {
      customerId: 'CUST-001',
      productId: 'PROD-001',
      purchaseDate: new Date('2024-01-15T10:00:00Z'),
      purchaseAmount: 0,
    };

    expect(() => {
      evaluatePurchaseHistoryDataQuality(invalidPurchaseHistory);
    }).toThrow(
      expect.objectContaining({
        errorCode: 'INVALID_PURCHASE_AMOUNT',
        message: '購買金額は0より大きい値である必要があります',
        targetField: 'purchaseAmount',
        detectedValue: 0,
      })
    );
  });
});