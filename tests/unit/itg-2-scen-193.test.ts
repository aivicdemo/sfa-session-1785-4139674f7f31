import { detectDuplicateAndMerge } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-193
  test('重複候補顧客が1件のとき、そのペアに対して統合判定が実行される', () => {
    const existingCustomer = {
      customerId: 'C001',
      name: '山田太郎',
      email: 'yamada@example.com',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    const candidateCustomer = {
      name: '山田太郎',
      email: 'yamada@example.com',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };

    const duplicateCandidates = [
      {
        existingId: 'C001',
        candidateIndex: 0,
        matchScore: 0.95,
      },
    ];

    const result = detectDuplicateAndMerge(
      [existingCustomer],
      [candidateCustomer],
      duplicateCandidates
    );

    expect(result.mergeJudgmentExecuted).toBe(true);
    expect(result.mergeJudgmentCallCount).toBe(1);
    expect(result.pairCount).toBe(2);
    expect(result.pairs).toHaveLength(1);
    expect(result.pairs[0]).toEqual({
      existingId: 'C001',
      candidateIndex: 0,
      matchScore: 0.95,
    });
    expect(result.processedRecordCount).toBe(2);
  });
});