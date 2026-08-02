import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-478
  test("重複検知ルール実行優先度決定機能 - 検知効率が高いほど優先度スコアが高くなる", () => {
    // Arrange: 検知効率が異なる3つの重複検知ルールをテストデータとして準備
    const ruleA = {
      ruleId: "rule-a",
      ruleName: "ルールA",
      detectionEfficiency: 0.8,
      qualityRiskDegree: 5,
    };

    const ruleB = {
      ruleId: "rule-b",
      ruleName: "ルールB",
      detectionEfficiency: 0.6,
      qualityRiskDegree: 3,
    };

    const ruleC = {
      ruleId: "rule-c",
      ruleName: "ルールC",
      detectionEfficiency: 0.95,
      qualityRiskDegree: 8,
    };

    const rules = [ruleA, ruleB, ruleC];

    // Act: 各ルールに対して優先度スコア計算ロジックを実行
    const priorityResults = decideDuplicateDetectionRulePriority(rules);

    // Assert: 計算結果の優先度スコアを検証
    // ルールCの優先度スコアが最も高い（検知効率95%）
    const resultC = priorityResults.find((r) => r.ruleId === "rule-c");
    const resultA = priorityResults.find((r) => r.ruleId === "rule-a");
    const resultB = priorityResults.find((r) => r.ruleId === "rule-b");

    expect(resultC).toBeDefined();
    expect(resultA).toBeDefined();
    expect(resultB).toBeDefined();

    // 優先度スコアが検知効率の値に比例して増加
    expect(resultC!.priorityScore).toBeGreaterThan(resultA!.priorityScore);
    expect(resultA!.priorityScore).toBeGreaterThan(resultB!.priorityScore);

    // 具体的な優先度スコアの値を検証（検知効率に比例）
    // 優先度スコア = 検知効率 * 100 + 品質リスク度 * 5 の計算ロジックを想定
    expect(resultC!.priorityScore).toBe(95 * 1 + 8 * 5);
    expect(resultA!.priorityScore).toBe(80 * 1 + 5 * 5);
    expect(resultB!.priorityScore).toBe(60 * 1 + 3 * 5);

    // ルール順序がC > A > B となることを確認
    expect(priorityResults[0].ruleId).toBe("rule-c");
    expect(priorityResults[1].ruleId).toBe("rule-a");
    expect(priorityResults[2].ruleId).toBe("rule-b");
  });
});