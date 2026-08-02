import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-489
  test("重複検知ルール実行優先度決定機能 - 優先度スコアが同値の複数ルールに対して安定ソートが適用される", () => {
    const ruleA = {
      ruleId: "RULE_A",
      ruleName: "ルールA",
      priorityScore: 100,
      dataQualityRiskLevel: "high",
      detectionEfficiency: 0.85,
    };

    const ruleB = {
      ruleId: "RULE_B",
      ruleName: "ルールB",
      priorityScore: 100,
      dataQualityRiskLevel: "high",
      detectionEfficiency: 0.82,
    };

    const ruleC = {
      ruleId: "RULE_C",
      ruleName: "ルールC",
      priorityScore: 100,
      dataQualityRiskLevel: "high",
      detectionEfficiency: 0.80,
    };

    const inputRules = [ruleA, ruleB, ruleC];

    const result = decideDuplicateDetectionRulePriority(inputRules);

    expect(result).toEqual([
      {
        ruleId: "RULE_A",
        ruleName: "ルールA",
        priorityScore: 100,
        dataQualityRiskLevel: "high",
        detectionEfficiency: 0.85,
      },
      {
        ruleId: "RULE_B",
        ruleName: "ルールB",
        priorityScore: 100,
        dataQualityRiskLevel: "high",
        detectionEfficiency: 0.82,
      },
      {
        ruleId: "RULE_C",
        ruleName: "ルールC",
        priorityScore: 100,
        dataQualityRiskLevel: "high",
        detectionEfficiency: 0.80,
      },
    ]);

    expect(result[0].ruleId).toBe("RULE_A");
    expect(result[1].ruleId).toBe("RULE_B");
    expect(result[2].ruleId).toBe("RULE_C");
  });
});