import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1504: [edge] evaluatePurchaseHistoryDataQuality detects empty product category and adds to non-conformance list', () => {
    // Arrange
    const purchaseHistoryRecord = {
      id: 'PH-001',
      customerId: 'CUST-12345',
      productCategory: '',
      purchaseDate: '2024-01-15T10:30:00Z',
      quantity: 5,
      unitPrice: 10000,
      totalAmount: 50000,
    };

    // Act
    const result = evaluatePurchaseHistoryDataQuality(purchaseHistoryRecord);

    // Assert
    expect(result.isConformant).toBe(false);
    expect(result.nonConformanceItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          recordId: 'PH-001',
          fieldName: 'productCategory',
          issueCode: 'CATEGORY_EMPTY',
          message: expect.stringMatching(/商品カテゴリが未入力|カテゴリ: 必須項目/),
        }),
      ])
    );
    expect(result.qualityScore).toBeLessThan(100);
  });
});