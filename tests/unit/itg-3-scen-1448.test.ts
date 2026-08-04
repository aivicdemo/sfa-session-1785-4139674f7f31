import { evaluatePurchaseHistoryDataQuality } from '../../src/logic/it-1-br-3-3-2-1';

describe('購買履歴データ品質判定機能', () => {
  // SCEN-1448
  test('複数の完全な購買履歴データで各データの品質スコアと不適合項目が正常に返される', () => {
    const purchase_history_1 = {
      customer_id: 'CUST-001',
      purchase_date: '2024-01-15',
      product_id: 'PROD-A001',
      amount: 50000,
      category: 'Software',
      purchase_channel: 'Online'
    };

    const purchase_history_2 = {
      customer_id: 'CUST-002',
      purchase_date: '2024-02-20',
      product_id: 'PROD-B002',
      amount: 120000,
      category: 'Hardware',
      purchase_channel: 'Direct Sales'
    };

    const purchase_history_3 = {
      customer_id: 'CUST-003',
      purchase_date: '2024-03-10',
      product_id: 'PROD-C003',
      amount: 75000,
      category: 'Service',
      purchase_channel: 'Partner'
    };

    const input_data = [purchase_history_1, purchase_history_2, purchase_history_3];
    const result = evaluatePurchaseHistoryDataQuality(input_data);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(3);

    expect(result[0]).toHaveProperty('score');
    expect(result[0]).toHaveProperty('mismatchedItems');
    expect(typeof result[0].score).toBe('number');
    expect(Array.isArray(result[0].mismatchedItems)).toBe(true);

    expect(result[0].score).toBeGreaterThanOrEqual(85);
    expect(result[0].mismatchedItems).toEqual([]);

    expect(result[1].score).toBeGreaterThanOrEqual(85);
    expect(result[1].mismatchedItems).toEqual([]);

    expect(result[2].score).toBeGreaterThanOrEqual(85);
    expect(result[2].mismatchedItems).toEqual([]);
  });
});