import { decideDuplicateDetectionRulePriority } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-475
  test('重複検知ルール実行優先度決定機能 - 重複検知ルールが1件のときに優先度スコア1を割り当てる', () => {
    const input_rules = [
      {
        rule_id: 'RULE-001',
        rule_name: '顧客名+電話番号の重複検知',
        quality_risk_score: 8,
        detection_efficiency_score: 7,
      },
    ];

    const result = decideDuplicateDetectionRulePriority(input_rules);

    expect(result).toEqual([
      {
        rule_id: 'RULE-001',
        rule_name: '顧客名+電話番号の重複検知',
        quality_risk_score: 8,
        detection_efficiency_score: 7,
        priority_score: 1,
      },
    ]);
    expect(result[0].priority_score).toBe(1);
  });
});