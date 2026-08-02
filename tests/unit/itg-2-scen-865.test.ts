import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-865
  test('正規化対象の顧客データが0件のとき、正規化結果が空結果で返される', () => {
    const input_customers = [];

    const result = normalizeCustomerData(input_customers);

    expect(result.normalizedCustomers).toEqual([]);
    expect(result.processedCount).toBe(0);
    expect(result.errorCount).toBe(0);
    expect(result.status).toBe('completed');
  });
});