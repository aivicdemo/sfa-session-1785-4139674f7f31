import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-257
  test('顧客マスタが0件のとき、重複検出処理がスキップされて空配列が返される', () => {
    const empty_customer_list: any[] = [];
    const start_time = Date.now();
    const result = detectDuplicateCustomers(empty_customer_list);
    const elapsed_time = Date.now() - start_time;

    expect(result).toEqual([]);
    expect(elapsed_time).toBeLessThanOrEqual(0);
  });
});