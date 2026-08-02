import { detectDuplicatesAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1127
  test('0件の顧客データが入力された場合、重複判定は実行されない', () => {
    const empty_customers = [];

    const result = detectDuplicatesAndMerge(empty_customers);

    expect(result).toEqual({
      merged_customers: [],
      duplicate_groups: [],
      processed_count: 0,
      skipped_status: 'no_data'
    });
  });
});