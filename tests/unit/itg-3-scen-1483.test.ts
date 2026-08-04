import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1483
  test('購買履歴データに重複が存在するときエラーを返す', () => {
    const duplicatePurchaseRecords = [
      {
        purchaseId: 'PUR-001',
        purchaseDateTime: '2024-01-15T10:00:00Z',
        productId: 'PROD-A',
        quantity: 10,
        amount: 50000,
      },
      {
        purchaseId: 'PUR-001',
        purchaseDateTime: '2024-01-15T10:00:00Z',
        productId: 'PROD-A',
        quantity: 10,
        amount: 50000,
      },
    ];

    expect(() => {
      validatePurchaseHistoryDataQuality(duplicatePurchaseRecords);
    }).toThrow(/DUPLICATE_PURCHASE_RECORD_DETECTED/);
  });
});