import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation - Year-Spanning Records', () => {
  // SCEN-1517
  test('should correctly evaluate data quality for purchase records spanning across year boundary', () => {
    const purchaseRecords = [
      {
        id: 'purchase_001',
        customerId: 'cust_001',
        purchaseDate: '2024-12-31',
        amount: 50000,
        productCategory: 'Software',
        quantity: 1,
        currency: 'JPY',
      },
      {
        id: 'purchase_002',
        customerId: 'cust_001',
        purchaseDate: '2025-01-01',
        amount: 75000,
        productCategory: 'Hardware',
        quantity: 2,
        currency: 'JPY',
      },
      {
        id: 'purchase_003',
        customerId: 'cust_001',
        purchaseDate: '2025-01-01',
        amount: 100000,
        productCategory: 'Consulting',
        quantity: 1,
        currency: 'JPY',
      },
    ];

    const result = evaluatePurchaseHistoryDataQuality(purchaseRecords);

    expect(result.totalRecordsEvaluated).toBe(3);
    expect(result.successfulEvaluations).toBe(3);
    expect(result.failedEvaluations).toBe(0);

    expect(result.recordResults).toHaveLength(3);

    expect(result.recordResults[0]).toEqual(
      expect.objectContaining({
        recordId: 'purchase_001',
        qualityStatus: 'PASS',
        qualityScore: expect.any(Number),
        hasErrors: false,
      })
    );

    expect(result.recordResults[1]).toEqual(
      expect.objectContaining({
        recordId: 'purchase_002',
        qualityStatus: 'PASS',
        qualityScore: expect.any(Number),
        hasErrors: false,
      })
    );

    expect(result.recordResults[2]).toEqual(
      expect.objectContaining({
        recordId: 'purchase_003',
        qualityStatus: 'PASS',
        qualityScore: expect.any(Number),
        hasErrors: false,
      })
    );

    const allScoresValid = result.recordResults.every(
      (record) => record.qualityScore >= 0 && record.qualityScore <= 100
    );
    expect(allScoresValid).toBe(true);

    const allStatusesValid = result.recordResults.every(
      (record) => record.qualityStatus === 'PASS' || record.qualityStatus === 'FAIL'
    );
    expect(allStatusesValid).toBe(true);

    expect(result.recordResults.every((record) => record.dateValidationError === undefined || record.dateValidationError === null)).toBe(true);
  });
});