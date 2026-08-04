import { evaluateDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1509: Data quality score is not affected by chronological order of purchase history', () => {
    const descendingPurchaseHistory = [
      {
        purchase_date: '2024-01-15T10:30:00Z',
        product_id: 'PROD001',
        quantity: 5,
        unit_price: 10000,
      },
      {
        purchase_date: '2024-01-10T14:20:00Z',
        product_id: 'PROD002',
        quantity: 3,
        unit_price: 15000,
      },
      {
        purchase_date: '2024-01-05T09:15:00Z',
        product_id: 'PROD001',
        quantity: 2,
        unit_price: 10000,
      },
      {
        purchase_date: '2024-01-01T16:45:00Z',
        product_id: 'PROD003',
        quantity: 1,
        unit_price: 20000,
      },
    ];

    const ascendingPurchaseHistory = [
      {
        purchase_date: '2024-01-01T16:45:00Z',
        product_id: 'PROD003',
        quantity: 1,
        unit_price: 20000,
      },
      {
        purchase_date: '2024-01-05T09:15:00Z',
        product_id: 'PROD001',
        quantity: 2,
        unit_price: 10000,
      },
      {
        purchase_date: '2024-01-10T14:20:00Z',
        product_id: 'PROD002',
        quantity: 3,
        unit_price: 15000,
      },
      {
        purchase_date: '2024-01-15T10:30:00Z',
        product_id: 'PROD001',
        quantity: 5,
        unit_price: 10000,
      },
    ];

    const descendingQualityResult = evaluateDataQuality(descendingPurchaseHistory);
    const ascendingQualityResult = evaluateDataQuality(ascendingPurchaseHistory);

    expect(descendingQualityResult.quality_score).toBe(ascendingQualityResult.quality_score);
    expect(descendingQualityResult.completeness_check).toBe(ascendingQualityResult.completeness_check);
    expect(descendingQualityResult.type_check).toBe(ascendingQualityResult.type_check);
    expect(descendingQualityResult.value_domain_check).toBe(ascendingQualityResult.value_domain_check);
  });
});