import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  // SCEN-1456
  test('should identify invalid purchase date formats as non-compliant items with specific error messages', () => {
    const testData = [
      {
        id: '1',
        customerId: 'CUST001',
        purchaseDate: '2024-13-45',
        amount: 50000,
      },
      {
        id: '2',
        customerId: 'CUST002',
        purchaseDate: 'invalid-date',
        amount: 75000,
      },
      {
        id: '3',
        customerId: 'CUST003',
        purchaseDate: '2024/12/32',
        amount: 100000,
      },
      {
        id: '4',
        customerId: 'CUST004',
        purchaseDate: '',
        amount: 60000,
      },
      {
        id: '5',
        customerId: 'CUST005',
        purchaseDate: '2024-12-25 25:00:00',
        amount: 80000,
      },
    ];

    const result = evaluatePurchaseHistoryDataQuality(testData);

    expect(result.isCompliant).toBe(false);
    expect(result.incomplianceItems).toHaveLength(5);

    expect(result.incomplianceItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          purchaseDate: '2024-13-45',
          errorMessage: '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）',
        }),
        expect.objectContaining({
          id: '2',
          purchaseDate: 'invalid-date',
          errorMessage: '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）',
        }),
        expect.objectContaining({
          id: '3',
          purchaseDate: '2024/12/32',
          errorMessage: '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）',
        }),
        expect.objectContaining({
          id: '4',
          purchaseDate: '',
          errorMessage: '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）',
        }),
        expect.objectContaining({
          id: '5',
          purchaseDate: '2024-12-25 25:00:00',
          errorMessage: '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）',
        }),
      ])
    );

    result.incomplianceItems.forEach((item) => {
      expect(item.errorMessage).toBe(
        '購買日時の形式が無効です（期待形式：YYYY-MM-DD HH:mm:ss）'
      );
    });
  });
});