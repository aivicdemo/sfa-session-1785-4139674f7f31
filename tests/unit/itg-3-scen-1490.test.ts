import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1490: evaluatePurchaseHistoryDataQuality returns quality score 0 and empty non-conforming items when purchase history data is empty', () => {
    const purchaseHistoryData = [];

    const result = evaluatePurchaseHistoryDataQuality(purchaseHistoryData);

    expect(result).toEqual({
      qualityScore: 0,
      nonConformingItems: []
    });
  });
});