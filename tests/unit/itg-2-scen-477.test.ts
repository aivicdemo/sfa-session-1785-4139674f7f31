import { calculateDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-477
  test("重複検知ルール実行優先度決定機能 - 品質リスク度合いが高いほど優先度スコアが高くなる", () => {
    const ruleA = {
      rule_id: "rule_a",
      rule_name: "顧客名完全一致ルール",
      quality_risk_level: "low",
      score_base: 100,
    };

    const ruleB = {
      rule_id: "rule_b",
      rule_name: "顧客名部分一致ルール",
      quality_risk_level: "medium",
      score_base: 200,
    };

    const ruleC = {
      rule_id: "rule_c",
      rule_name: "顧客住所・電話番号一致ルール",
      quality_risk_level: "high",
      score_base: 300,
    };

    const priorityScoreA = calculateDuplicateDetectionRulePriority(ruleA);
    const priorityScoreB = calculateDuplicateDetectionRulePriority(ruleB);
    const priorityScoreC = calculateDuplicateDetectionRulePriority(ruleC);

    expect(priorityScoreA).toBe(100);
    expect(priorityScoreB).toBe(200);
    expect(priorityScoreC).toBe(300);
    expect(priorityScoreA < priorityScoreB).toBe(true);
    expect(priorityScoreB < priorityScoreC).toBe(true);
  });
});