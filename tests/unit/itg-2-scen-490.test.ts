import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-490
  test("重複検知ルール実行優先度決定機能 - 重複検知ルールの順序が逆のときに正しく優先度付けされる", () => {
    const input_rules = [
      {
        rule_id: "rule_3",
        rule_name: "ルール3",
        priority: 1,
        risk_score: 30,
        efficiency_score: 40,
      },
      {
        rule_id: "rule_2",
        rule_name: "ルール2",
        priority: 2,
        risk_score: 60,
        efficiency_score: 70,
      },
      {
        rule_id: "rule_1",
        rule_name: "ルール1",
        priority: 3,
        risk_score: 90,
        efficiency_score: 85,
      },
    ];

    const result = decideDuplicateDetectionRulePriority(input_rules);

    expect(result).toEqual([
      {
        rule_id: "rule_1",
        rule_name: "ルール1",
        priority: 3,
        risk_score: 90,
        efficiency_score: 85,
        execution_order: 1,
      },
      {
        rule_id: "rule_2",
        rule_name: "ルール2",
        priority: 2,
        risk_score: 60,
        efficiency_score: 70,
        execution_order: 2,
      },
      {
        rule_id: "rule_3",
        rule_name: "ルール3",
        priority: 1,
        risk_score: 30,
        efficiency_score: 40,
        execution_order: 3,
      },
    ]);
  });
});