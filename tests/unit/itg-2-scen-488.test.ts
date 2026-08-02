import { calculateDuplicateDetectionPriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('重複検知ルール実行優先度決定機能', () => {
  // SCEN-488
  test('重複検知ルール実行優先度決定機能 - 計算結果が昇順に並び替えられる', () => {
    const rules = [
      { ruleId: 'rule_a', qualityRiskScore: 85, detectionEfficiency: 0.75 },
      { ruleId: 'rule_b', qualityRiskScore: 72, detectionEfficiency: 0.80 },
      { ruleId: 'rule_c', qualityRiskScore: 91, detectionEfficiency: 0.70 },
    ];

    const result = calculateDuplicateDetectionPriority(rules);

    const scores = result.map((r) => r.priorityScore);
    expect(scores).toEqual([72, 85, 91]);
    expect(result[0].ruleId).toBe('rule_b');
    expect(result[1].ruleId).toBe('rule_a');
    expect(result[2].ruleId).toBe('rule_c');
  });
});