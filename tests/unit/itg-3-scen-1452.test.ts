import { validatePurchaseHistoryQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1452
  test('購買金額が欠けている購買履歴データが不適合項目に含まれて返される', async () => {
    const purchaseHistoryDataset = [
      {
        purchaseAmount: 15000,
        purchaseDate: '2024-01-15',
        productId: 'PROD-001',
      },
      {
        purchaseAmount: null,
        purchaseDate: '2024-01-20',
        productId: 'PROD-002',
      },
      {
        purchaseAmount: '',
        purchaseDate: '2024-01-25',
        productId: 'PROD-003',
      },
    ];

    const result = await validatePurchaseHistoryQuality(purchaseHistoryDataset);

    expect(result.invalidItems).toHaveLength(2);

    const invalidProductIds = result.invalidItems.map(
      (item: any) => item.productId
    );
    expect(invalidProductIds).toContain('PROD-002');
    expect(invalidProductIds).toContain('PROD-003');
    expect(invalidProductIds).not.toContain('PROD-001');

    const nullAmountItem = result.invalidItems.find(
      (item: any) => item.productId === 'PROD-002'
    );
    expect(nullAmountItem.errorReason).toMatch(/購買金額/);
    expect(nullAmountItem.errorReason).toMatch(/必須/);

    const emptyAmountItem = result.invalidItems.find(
      (item: any) => item.productId === 'PROD-003'
    );
    expect(emptyAmountItem.errorReason).toMatch(/購買金額/);
    expect(emptyAmountItem.errorReason).toMatch(/空値/);

    const validItem = result.invalidItems.find(
      (item: any) => item.productId === 'PROD-001'
    );
    expect(validItem).toBeUndefined();
  });
});