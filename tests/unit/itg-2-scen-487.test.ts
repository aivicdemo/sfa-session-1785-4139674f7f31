import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-487
  test("重複検知ルール実行優先度決定機能 - 検知効率がnullのときにエラーが発生する", () => {
    const ruleData = {
      ruleId: "rule_001",
      ruleName: "duplicate_detection_rule_1",
      dataQualityRiskScore: 85,
      detectionEfficiency: null,
      executionPriority: 0,
    };

    expect(() => decideDuplicateDetectionRulePriority(ruleData)).toThrow(
      /検知効率/
    );
  });
});