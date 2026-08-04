import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1484: 購買履歴データ品質判定 - 購買金額が最大許容値を超えるときエラーを返す', () => {
    // Arrange
    const MAX_PURCHASE_AMOUNT = 999_999_999;
    const OVER_LIMIT_AMOUNT = 1_000_000_000;
    
    const purchaseHistoryData = {
      purchaseAmount: OVER_LIMIT_AMOUNT,
      purchaseDate: '2024-01-15',
      customerId: 'CUST-001',
      productCategory: 'software-license',
      quantity: 10,
    };

    // Act & Assert
    expect(() => {
      evaluatePurchaseHistoryDataQuality(purchaseHistoryData);
    }).toThrow(/購買金額/);
  });
});