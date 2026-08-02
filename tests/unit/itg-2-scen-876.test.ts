import { determineDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-876: 統合判定対象の重複顧客が0件のとき、統合判定結果が空結果で返される', () => {
    const duplicateCandidates = [];

    const result = determineDuplicateCustomers(duplicateCandidates);

    expect(result.merge_target_count).toBe(0);
    expect(result.merge_groups).toEqual([]);
    expect(result.merge_determination_status).toBe('NO_DUPLICATE');
  });
});