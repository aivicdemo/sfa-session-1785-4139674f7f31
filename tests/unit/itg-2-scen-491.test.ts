import { determineDeduplicationRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-491
  test('重複検知ルール実行優先度決定機能 - 同じ入力で2回実行しても同じ優先度スコアと順序が得られる', () => {
    // 1回目の実行用入力データセット
    const inputDataSet = {
      operationIds: ['OPS-001', 'OPS-002', 'OPS-003'],
      customerIds: ['CUST-A', 'CUST-B', 'CUST-C'],
      amounts: [150000, 250000, 120000],
      dates: ['2024-01-15', '2024-02-10', '2024-03-05'],
      qualityRiskLevels: ['high', 'medium', 'high'],
      detectionEfficiencies: [0.95, 0.78, 0.92],
    };

    // 1回目の実行
    const firstExecutionResult = determineDeduplicationRulePriority(inputDataSet);
    const firstPriorityScores = firstExecutionResult.priorityScores;
    const firstExecutionOrder = firstExecutionResult.executionOrder;

    // 2回目の実行（同じ入力データセット）
    const secondExecutionResult = determineDeduplicationRulePriority(inputDataSet);
    const secondPriorityScores = secondExecutionResult.priorityScores;
    const secondExecutionOrder = secondExecutionResult.executionOrder;

    // 期待値: 1回目と2回目の優先度スコアが完全に一致
    expect(firstPriorityScores).toEqual(secondPriorityScores);

    // 期待値: 1回目と2回目の検知ルール実行順序が完全に一致
    expect(firstExecutionOrder).toEqual(secondExecutionOrder);

    // 追加検証: 優先度スコアの妥当性確認
    expect(firstPriorityScores).toHaveLength(3);
    expect(firstPriorityScores[0]).toBeGreaterThan(0);
    expect(firstPriorityScores[1]).toBeGreaterThan(0);
    expect(firstPriorityScores[2]).toBeGreaterThan(0);

    // 追加検証: 実行順序がルールIDのリストであることを確認
    expect(firstExecutionOrder).toHaveLength(3);
    expect(Array.isArray(firstExecutionOrder)).toBe(true);
  });
});