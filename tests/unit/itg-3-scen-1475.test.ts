import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  // SCEN-1475: [error] 購買履歴データ品質判定機能 - 購買数量が負数のときエラーを返す
  test('購買数量が負数の場合、INVALID_PURCHASE_QUANTITYエラーを返す', () => {
    const input = {
      customerId: 'CUST001',
      productId: 'PROD001',
      purchaseDate: '2024-01-15T10:00:00Z',
      purchaseQuantity: -5,
    };

    const result = validatePurchaseHistoryDataQuality(input);

    expect(result).toEqual({
      isValid: false,
      errorCode: 'INVALID_PURCHASE_QUANTITY',
      errorMessage: '購買数量は0以上の値である必要があります。入力値：-5',
      httpStatusCode: 400,
    });
  });
});