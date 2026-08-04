import { evaluatePurchaseDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  // SCEN-1485: [error] 購買履歴データ品質判定機能 - 購買数量が業務上の最大規模を超えるときエラーを返す
  test('購買数量が業務上の最大規模を超える場合、適切なエラーレスポンスを返す', () => {
    const input = {
      purchaseQuantity: 10001,
      businessLimitQuantity: 10000,
      customerId: 'CUST-12345',
      productId: 'PROD-67890',
      purchaseDate: '2024-01-15T10:30:00Z',
    };

    const result = evaluatePurchaseDataQuality(input);

    expect(result).toEqual({
      isValid: false,
      statusCode: 422,
      errorCode: 'PURCHASE_QUANTITY_EXCEEDED',
      errorMessage: '購買数量が業務上の最大規模（10,000単位）を超えています。入力値を確認してください',
      invalidFields: ['purchaseQuantity'],
      businessLimitValue: 10000,
      recommendationGenerated: false,
      reportGenerated: false,
    });
  });
});