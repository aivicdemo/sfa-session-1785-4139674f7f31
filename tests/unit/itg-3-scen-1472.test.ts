import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  test('SCEN-1472: 購買金額が負数のときエラーを返す', () => {
    const invalidPurchaseRecord = {
      recordId: 'REC-001',
      customerId: 'CUST-123',
      purchaseAmount: -1000,
      purchaseDate: '2024-01-15',
      productCategory: '消耗品',
    };

    const result = validatePurchaseHistoryDataQuality(invalidPurchaseRecord);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('INVALID_PURCHASE_AMOUNT');
    expect(result.errorMessage).toMatch(/購買金額は0以上/);
    expect(result.details).toEqual({
      recordId: 'REC-001',
      detectedValue: -1000,
    });
    expect(result.httpStatusCode).toBe(400);
  });
});