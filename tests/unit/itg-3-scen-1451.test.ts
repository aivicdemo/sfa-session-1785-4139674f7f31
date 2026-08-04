import { validatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Validation', () => {
  test('SCEN-1451: Should identify records with missing purchase datetime as non-compliant', () => {
    const testDataset = [
      {
        recordId: 'PH001',
        purchaseDate: null,
        productId: 'PROD001',
        quantity: 10,
      },
      {
        recordId: 'PH002',
        purchaseDate: undefined,
        productId: 'PROD002',
        quantity: 5,
      },
      {
        recordId: 'PH003',
        purchaseDate: '',
        productId: 'PROD003',
        quantity: 20,
      },
      {
        recordId: 'PH004',
        purchaseDate: '2024-01-15T10:30:00Z',
        productId: 'PROD004',
        quantity: 15,
      },
      {
        recordId: 'PH005',
        purchaseDate: '2024-02-20T14:45:00Z',
        productId: 'PROD005',
        quantity: 8,
      },
    ];

    const result = validatePurchaseHistoryDataQuality(testDataset);

    expect(result.nonCompliantItems).toBeDefined();
    expect(result.nonCompliantItems).toHaveLength(3);

    const recordIdsInNonCompliant = result.nonCompliantItems.map(
      (item) => item.recordId
    );
    expect(recordIdsInNonCompliant).toEqual(
      expect.arrayContaining(['PH001', 'PH002', 'PH003'])
    );

    result.nonCompliantItems.forEach((item) => {
      expect(item.errorFieldName).toBe('購買日時');
      expect(item.errorReason).toMatch(/購買日時が(欠けています|未設定です)/);
    });

    const compliantRecordIds = result.compliantItems.map((item) => item.recordId);
    expect(compliantRecordIds).toEqual(
      expect.arrayContaining(['PH004', 'PH005'])
    );
    expect(compliantRecordIds).toHaveLength(2);
  });
});