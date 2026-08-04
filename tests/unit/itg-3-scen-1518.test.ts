import { validateQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1518
  test('購買日付が月をまたぐとき品質判定が正常に実行される', () => {
    const purchaseHistoryRecords = [
      {
        purchaseId: 'PUR-001',
        customerId: 'CUST-A001',
        purchaseDate: '2024-01-31',
        productId: 'PROD-X001',
        quantity: 5,
        unitPrice: 1000,
        totalAmount: 5000,
        currency: 'JPY',
        paymentStatus: 'completed',
        deliveryDate: '2024-02-05',
      },
      {
        purchaseId: 'PUR-002',
        customerId: 'CUST-A001',
        purchaseDate: '2024-02-01',
        productId: 'PROD-X002',
        quantity: 3,
        unitPrice: 2000,
        totalAmount: 6000,
        currency: 'JPY',
        paymentStatus: 'completed',
        deliveryDate: '2024-02-10',
      },
    ];

    const result = validateQuality(purchaseHistoryRecords);

    expect(result.overallQualityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.overallQualityScore).toBeLessThanOrEqual(1.0);
    expect(typeof result.overallQualityScore).toBe('number');

    expect(result.hasMonthBoundaryIssues).toBe(false);

    expect(Array.isArray(result.fieldValidationResults)).toBe(true);
    expect(result.fieldValidationResults.length).toBe(2);

    result.fieldValidationResults.forEach((validation) => {
      expect(validation.recordId).toBeDefined();
      expect(validation.status).toBe('completed');
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(validation.errors.length).toBe(0);
    });

    expect(result.fieldValidationResults[0].recordId).toBe('PUR-001');
    expect(result.fieldValidationResults[1].recordId).toBe('PUR-002');
  });
});