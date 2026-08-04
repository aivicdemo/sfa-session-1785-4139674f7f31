import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1450: 顧客IDが欠けている購買履歴データが不適合項目に含まれて返される', () => {
    const purchaseHistoryRecords = [
      {
        orderId: '12345',
        productId: 'PROD-001',
        amount: 50000,
        purchaseDate: '2026-01-15',
      },
      {
        customerId: 'CUST-999',
        orderId: '12346',
        productId: 'PROD-002',
        amount: 75000,
        purchaseDate: '2026-01-16',
      },
    ];

    const result = evaluateDataQuality(purchaseHistoryRecords);

    expect(result.defectItems).toHaveLength(1);
    expect(result.defectItems[0]).toEqual({
      orderId: '12345',
      defectType: 'MISSING_CUSTOMER_ID',
      severity: 'ERROR',
      message: '顧客IDが必須項目です',
    });
    expect(result.qualityScore).toBe(50);
    expect(
      result.defectItems.some((item) => item.orderId === '12346')
    ).toBe(false);
  });
});