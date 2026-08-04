import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1514
  test('購買日付が月末のとき品質判定が正常に実行される', () => {
    const purchaseRecords = [
      {
        customerId: 'CUST001',
        productId: 'PROD001',
        purchaseDate: '2026-02-28',
        purchaseAmount: 150000,
        purchaseQuantity: 5,
      },
      {
        customerId: 'CUST002',
        productId: 'PROD002',
        purchaseDate: '2026-04-30',
        purchaseAmount: 200000,
        purchaseQuantity: 8,
      },
      {
        customerId: 'CUST003',
        productId: 'PROD003',
        purchaseDate: '2026-06-30',
        purchaseAmount: 175000,
        purchaseQuantity: 6,
      },
    ];

    const startTime = Date.now();
    const result = evaluateDataQuality(purchaseRecords);
    const endTime = Date.now();
    const executionTimeMs = endTime - startTime;

    expect(result.qualityStatus).toMatch(/^(VALID|ACCEPTABLE)$/);
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);
    expect(result.qualityScore).toBe(Math.floor(result.qualityScore));
    expect(
      result.errorMessage === '' || result.errorMessage === null || result.errorMessage === undefined
    ).toBe(true);
    expect(executionTimeMs).toBeLessThan(5000);
  });
});