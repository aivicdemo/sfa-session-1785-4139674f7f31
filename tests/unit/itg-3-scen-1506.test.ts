import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  test('SCEN-1506: 顧客IDが空文字列のとき不適合項目に追加される', () => {
    const purchase_history_record = {
      customer_id: '',
      product_id: 'PROD-001',
      purchase_amount: 100000,
      purchase_date: '2024-01-15',
      quantity: 5
    };

    const result = evaluatePurchaseHistoryDataQuality(purchase_history_record);

    expect(result.compliance_score).toBeLessThan(100);
    expect(result.non_compliance_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field_name: 'customer_id',
          error_code: 'CUSTOMER_ID_EMPTY',
          severity: 'error'
        })
      ])
    );
    expect(result.non_compliance_items.length).toBeGreaterThanOrEqual(1);
  });
});