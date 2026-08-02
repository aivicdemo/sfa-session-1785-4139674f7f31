import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1100
  test('同じ重複候補で2回判定を実行しても同じ結果が得られる', () => {
    const candidatePair = {
      customer_a: {
        id: '001',
        name: '山田太郎',
        email: 'yamada@example.com',
      },
      customer_b: {
        id: '002',
        name: '山田太郎',
        email: 'yamada@example.com',
      },
    };

    const firstResult = detectDuplicateCustomers(candidatePair);
    const secondResult = detectDuplicateCustomers(candidatePair);

    expect(firstResult.duplicate_score).toBe(secondResult.duplicate_score);
    expect(firstResult.is_duplicate).toBe(secondResult.is_duplicate);
    expect(firstResult.matched_fields).toEqual(secondResult.matched_fields);
  });
});