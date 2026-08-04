import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1462: [normal] duplicate purchase history records are detected and included in non-conforming items', async () => {
    const duplicatePurchaseHistoryDataset = [
      {
        id: 'record_001',
        customerId: 'cust_12345',
        productId: 'prod_789',
        purchaseDate: '2024-01-15T10:30:00Z',
        amount: 50000,
        quantity: 5,
      },
      {
        id: 'record_002',
        customerId: 'cust_12345',
        productId: 'prod_789',
        purchaseDate: '2024-01-15T10:30:00Z',
        amount: 50000,
        quantity: 5,
      },
      {
        id: 'record_003',
        customerId: 'cust_12345',
        productId: 'prod_456',
        purchaseDate: '2024-01-20T14:15:00Z',
        amount: 75000,
        quantity: 3,
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'standard',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const result = await evaluatePurchaseHistoryDataQuality(
      duplicatePurchaseHistoryDataset,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe('non-conforming');

    expect(result.nonConformingItems).toBeDefined();
    expect(Array.isArray(result.nonConformingItems)).toBe(true);

    const duplicateDetected = result.nonConformingItems.find(
      (item: { type: string }) => item.type === 'duplicate_record_detected'
    );
    expect(duplicateDetected).toBeDefined();

    expect(duplicateDetected.duplicateDetails).toBeDefined();
    expect(Array.isArray(duplicateDetected.duplicateDetails)).toBe(true);
    expect(duplicateDetected.duplicateDetails.length).toBeGreaterThan(0);

    const firstDuplicateDetail = duplicateDetected.duplicateDetails[0];
    expect(firstDuplicateDetail.recordIds).toEqual(['record_001', 'record_002']);
    expect(firstDuplicateDetail.customerId).toBe('cust_12345');
    expect(firstDuplicateDetail.productId).toBe('prod_789');
    expect(firstDuplicateDetail.purchaseDate).toBe('2024-01-15T10:30:00Z');
    expect(firstDuplicateDetail.amount).toBe(50000);

    expect(result.qualityScore).toBeLessThan(100);
    expect(typeof result.qualityScore).toBe('number');
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
  });
});