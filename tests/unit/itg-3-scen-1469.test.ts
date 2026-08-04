import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  // SCEN-1469
  test('購買日時が欠けているときエラーを返す', () => {
    const invalidPurchaseHistory = {
      productId: 'PROD-001',
      customerId: 'CUST-001',
      purchaseAmount: 50000,
      purchaseDateTime: null,
    };

    expect(() => {
      evaluatePurchaseHistoryDataQuality(invalidPurchaseHistory);
    }).toThrow(/購買日時/);
  });
});