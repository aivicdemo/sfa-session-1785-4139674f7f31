import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('Purchase History Data Quality Evaluation', () => {
  test('SCEN-1455: [normal] Purchase history with 0 yen amount should be included in non-conformance items', () => {
    const testPurchaseHistoryDataset = [
      {
        purchase_id: 'PH001',
        customer_id: 'CUST001',
        purchase_amount: 50000,
        purchase_date: '2024-01-15'
      },
      {
        purchase_id: 'PH002',
        customer_id: 'CUST001',
        purchase_amount: 0,
        purchase_date: '2024-01-20'
      },
      {
        purchase_id: 'PH003',
        customer_id: 'CUST001',
        purchase_amount: 120000,
        purchase_date: '2024-02-10'
      },
      {
        purchase_id: 'PH004',
        customer_id: 'CUST001',
        purchase_amount: 0,
        purchase_date: '2024-02-15'
      },
      {
        purchase_id: 'PH005',
        customer_id: 'CUST001',
        purchase_amount: 75000,
        purchase_date: '2024-03-05'
      },
      {
        purchase_id: 'PH006',
        customer_id: 'CUST001',
        purchase_amount: 0,
        purchase_date: '2024-03-20'
      }
    ];

    const result = evaluatePurchaseHistoryDataQuality(testPurchaseHistoryDataset);

    expect(result.non_conformance_items).toHaveLength(3);
    
    expect(result.non_conformance_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          purchase_id: 'PH002',
          non_conformance_reason: '購買金額：0円'
        }),
        expect.objectContaining({
          purchase_id: 'PH004',
          non_conformance_reason: '購買金額：0円'
        }),
        expect.objectContaining({
          purchase_id: 'PH006',
          non_conformance_reason: '購買金額：0円'
        })
      ])
    );

    const non_conforming_ids = result.non_conformance_items.map((item: { purchase_id: string }) => item.purchase_id);
    expect(non_conforming_ids).toContain('PH002');
    expect(non_conforming_ids).toContain('PH004');
    expect(non_conforming_ids).toContain('PH006');
    expect(non_conforming_ids).not.toContain('PH001');
    expect(non_conforming_ids).not.toContain('PH003');
    expect(non_conforming_ids).not.toContain('PH005');

    expect(result.quality_score).toBeLessThan(100);
    expect(result.quality_score).toBeGreaterThanOrEqual(0);
  });
});