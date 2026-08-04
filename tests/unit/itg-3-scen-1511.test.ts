import { PurchaseHistoryDataQualityValidator } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Validation', () => {
  // SCEN-1511
  test('should detect complete duplicate records in purchase history data', () => {
    const validator = new PurchaseHistoryDataQualityValidator();

    const purchaseHistoryDataset = [
      {
        customerId: 'CUST001',
        productId: 'PROD123',
        purchaseDateTime: '2024-01-15T10:30:00Z',
        amount: 50000,
        quantity: 2,
      },
      {
        customerId: 'CUST001',
        productId: 'PROD123',
        purchaseDateTime: '2024-01-15T10:30:00Z',
        amount: 50000,
        quantity: 2,
      },
      {
        customerId: 'CUST002',
        productId: 'PROD456',
        purchaseDateTime: '2024-01-16T14:00:00Z',
        amount: 75000,
        quantity: 1,
      },
    ];

    const qualityResult = validator.validateDataQuality(purchaseHistoryDataset);

    expect(qualityResult.nonConformingItems).toHaveLength(2);
    expect(qualityResult.nonConformingItems[0].defectType).toBe('COMPLETE_DUPLICATE');
    expect(qualityResult.nonConformingItems[1].defectType).toBe('COMPLETE_DUPLICATE');
    expect(qualityResult.nonConformingItems[0].customerId).toBe('CUST001');
    expect(qualityResult.nonConformingItems[0].productId).toBe('PROD123');
    expect(qualityResult.nonConformingItems[0].purchaseDateTime).toBe('2024-01-15T10:30:00Z');
    expect(qualityResult.nonConformingItems[0].amount).toBe(50000);
    expect(qualityResult.nonConformingItems[1].customerId).toBe('CUST001');
    expect(qualityResult.nonConformingItems[1].productId).toBe('PROD123');
    expect(qualityResult.nonConformingItems[1].purchaseDateTime).toBe('2024-01-15T10:30:00Z');
    expect(qualityResult.nonConformingItems[1].amount).toBe(50000);
    expect(qualityResult.qualityStatus).toBe('NON_CONFORMING');
  });
});