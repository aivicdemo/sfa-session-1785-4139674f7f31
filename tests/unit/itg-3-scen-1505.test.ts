import { evaluateHistoricalDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1505: Missing customerId field is added to defectItems with error severity', () => {
    const purchaseHistoryRecord = {
      orderId: 'ORD-001',
      amount: 50000,
      date: '2025-01-15',
    };

    const result = evaluateHistoricalDataQuality(purchaseHistoryRecord);

    expect(result.defectItems).not.toEqual([]);
    expect(result.defectItems).toContainEqual(
      expect.objectContaining({
        fieldName: 'customerId',
        defectType: 'missing',
        severity: 'error',
      })
    );
    expect(result.qualityScore).toBeLessThan(100);
    expect(result.isUsableForLearning).toBe(false);
  });
});