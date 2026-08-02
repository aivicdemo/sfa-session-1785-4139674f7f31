import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-602
  test('妥当性検証で金額が業務上の最大規模値の場合、合格と判定される', () => {
    const MAX_AMOUNT_JPY = 9_999_999_999;

    const salesData = {
      amount: MAX_AMOUNT_JPY,
      customerId: 'CUST001',
      productId: 'PROD001',
      transactionDate: '2024-01-15',
    };

    const result = validateSalesDataQuality(salesData);

    expect(result.status).toBe('合格');
    expect(result.errorMessages).toEqual([]);
  });
});