import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1500: Missing purchaseAmount field is detected as quality issue', () => {
    const recordIdWithMissingAmount = 'purchase_001';
    const existingIssueCount = 0;

    const purchaseHistoryDataset = {
      records: [
        {
          recordId: recordIdWithMissingAmount,
          customerId: 'cust_123',
          purchaseDate: '2024-01-15T10:00:00Z',
          purchaseAmount: null,
          productCategory: 'Software',
          quantity: 5,
        },
      ],
      totalRecords: 1,
    };

    const result = evaluatePurchaseHistoryDataQuality(purchaseHistoryDataset);

    const expectedQualityIssue = {
      fieldName: 'purchaseAmount',
      issueType: 'MISSING_REQUIRED_FIELD',
      severity: 'ERROR',
      recordId: recordIdWithMissingAmount,
      message: '購買金額フィールドが欠落しています',
    };

    expect(result.qualityIssues).toContainEqual(expectedQualityIssue);
    expect(result.qualityIssues.length).toBe(existingIssueCount + 1);
    expect(result.qualityScore).toBeLessThan(100);
  });
});