import { detectAndMergeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-468
  test('重複候補顧客データがnullである場合、ERR_DUPLICATE_CANDIDATE_NULLエラーが発生する', () => {
    expect(() => {
      detectAndMergeDuplicateCustomers(null as any);
    }).toThrow(/ERR_DUPLICATE_CANDIDATE_NULL/);
  });
});