import { detectDuplicateAndMergeCustomer } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-339
  test('重複候補となる顧客データが0件の場合、統合判定が実行される', () => {
    const inputCustomer = {
      customer_id: 'TEST-001',
      name: '山田太郎',
      address: '東京都渋谷区',
    };

    const result = detectDuplicateAndMergeCustomer(inputCustomer);

    expect(result).toEqual({
      customer_id: 'TEST-001',
      name: '山田太郎',
      address: '東京都渋谷区',
      duplicate_count: 0,
      merge_executed: true,
    });
    expect(result.merge_executed).toBe(true);
    expect(result.duplicate_count).toBe(0);
  });
});