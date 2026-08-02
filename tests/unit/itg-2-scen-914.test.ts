import { detectDuplicateInPurchaseHistory } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-914
  test('購買履歴データに重複レコードが含まれるとき重複を検出して通知する', () => {
    const customerId = 'CUST-001';
    const productId = 'PROD-A123';
    const purchaseDateTime = '2024-01-15T10:30:00Z';

    const purchaseHistoryDataset = [
      {
        customerId: customerId,
        productId: productId,
        purchaseDateTime: purchaseDateTime,
        quantity: 5,
        amount: 50000,
      },
      {
        customerId: customerId,
        productId: productId,
        purchaseDateTime: purchaseDateTime,
        quantity: 5,
        amount: 50000,
      },
      {
        customerId: 'CUST-002',
        productId: 'PROD-B456',
        purchaseDateTime: '2024-01-16T14:00:00Z',
        quantity: 3,
        amount: 30000,
      },
    ];

    const result = detectDuplicateInPurchaseHistory(purchaseHistoryDataset);

    expect(result).toEqual({
      status: '重複検出',
      duplicates: [
        {
          customerId: customerId,
          productId: productId,
          purchaseDateTime: purchaseDateTime,
          duplicateCount: 2,
          matchLevel: '完全一致',
        },
      ],
      totalDuplicateGroups: 1,
    });
  });
});