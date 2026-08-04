import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 購買履歴データ品質判定', () => {
  test('SCEN-1479: 購買日時が未来日のときエラーを返す', () => {
    const currentDate = new Date('2026-08-01T10:00:00Z');
    const futurePurchaseDate = new Date('2026-08-02T15:30:00Z');

    const purchaseHistoryData = {
      purchaseDate: futurePurchaseDate,
      customerId: 'CUST-001',
      productId: 'PROD-123',
      quantity: 5,
      amount: 50000,
    };

    expect(() => {
      validatePurchaseHistoryDataQuality(purchaseHistoryData, currentDate);
    }).toThrow(/INVALID_PURCHASE_DATE_FUTURE/);
  });
});