import { calculateDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-480
  test("重複検知ルール実行優先度決定機能 - 検知効率が0のときに優先度スコアに反映されない", () => {
    const ruleWithEfficiency05 = {
      ruleId: "rule_001",
      coverageRange: 80,
      ruleTrustDegree: 0.95,
      detectionEfficiency: 0.5,
    };

    const ruleWithEfficiency0 = {
      ruleId: "rule_002",
      coverageRange: 80,
      ruleTrustDegree: 0.95,
      detectionEfficiency: 0,
    };

    const scoreWith05Efficiency = calculateDuplicateDetectionRulePriority(
      ruleWithEfficiency05
    );
    const scoreWith0Efficiency = calculateDuplicateDetectionRulePriority(
      ruleWithEfficiency0
    );

    expect(scoreWith05Efficiency).toBeGreaterThan(0);
    expect(scoreWith0Efficiency).toBeLessThan(scoreWith05Efficiency);

    const efficiencyContribution = scoreWith05Efficiency - scoreWith0Efficiency;
    expect(efficiencyContribution).toBeCloseTo(
      80 * 0.95 * 0.5,
      2
    );
  });
});