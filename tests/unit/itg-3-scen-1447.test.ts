import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1447: Complete purchase history data returns quality score 100 with no mismatch items', () => {
    const completePurchaseHistoryData = {
      customerId: 'CUST-001',
      purchaseDateTime: '2024-01-15T14:30:00Z',
      productId: 'PROD-A001',
      purchaseAmount: 150000,
      purchaseQuantity: 5,
      paymentMethod: 'credit_card',
      shippingAddress: '123 Business Avenue, Tokyo, 100-0001, Japan',
      purchaseChannel: 'web_portal'
    };

    const result = evaluatePurchaseHistoryDataQuality(completePurchaseHistoryData);

    expect(result.qualityScore).toBe(100);
    expect(result.mismatchItems).toEqual([]);
    expect(result.status).toBe('SUCCESS');
  });
});