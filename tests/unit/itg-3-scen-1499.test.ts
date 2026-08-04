import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  // SCEN-1499
  test('should mark purchase history record as non-conforming when purchaseDate field is missing', () => {
    const purchaseHistoryWithMissingDate = {
      purchaseId: 'PH-001',
      customerId: 'CUST-123',
      productId: 'PROD-456',
      purchaseDate: null,
      quantity: 5,
      amount: 50000,
    };

    const result = evaluateDataQuality([purchaseHistoryWithMissingDate]);

    expect(result.isNonConforming).toBe(true);
    expect(result.nonConformingItems).toHaveLength(1);
    expect(result.nonConformingItems[0]).toMatchObject({
      recordId: 'PH-001',
      errorCode: 'PURCHASE_DATE_MISSING',
      errorMessage: /購買日付が欠落/,
    });
  });
});