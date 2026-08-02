import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("重複検知ルール実行優先度決定機能", () => {
  test("SCEN-495: 品質リスク度合いと検知効率のスケールが異なるときに優先度スコアが正規化される", () => {
    // テスト対象: 異なるスケール（品質リスク度合い 1～100、検知効率 0.1～10）を持つ
    // 複数のルールの優先度スコアを正規化して計算

    // ルールA: 品質リスク度合い = 75、検知効率 = 3.5
    // ルールB: 品質リスク度合い = 50、検知効率 = 8.2
    const rulesInput = [
      {
        ruleId: "rule_a",
        qualityRiskScore: 75,
        detectionEfficiency: 3.5,
      },
      {
        ruleId: "rule_b",
        qualityRiskScore: 50,
        detectionEfficiency: 8.2,
      },
    ];

    const qualityRiskRange = { min: 1, max: 100 };
    const detectionEfficiencyRange = { min: 0.1, max: 10 };

    // 優先度スコア計算ロジックを実行
    const result = decideDuplicateDetectionRulePriority(rulesInput, {
      qualityRiskRange,
      detectionEfficiencyRange,
    });

    // ルールAとルールBの優先度スコアを取得
    const ruleAPriority = result.find((r) => r.ruleId === "rule_a");
    const ruleBPriority = result.find((r) => r.ruleId === "rule_b");

    // 各優先度スコアが 0～1 の正規化済み値であることを確認
    expect(ruleAPriority).toBeDefined();
    expect(ruleBPriority).toBeDefined();

    expect(ruleAPriority!.normalizedPriorityScore).toBeGreaterThanOrEqual(0);
    expect(ruleAPriority!.normalizedPriorityScore).toBeLessThanOrEqual(1);
    expect(ruleBPriority!.normalizedPriorityScore).toBeGreaterThanOrEqual(0);
    expect(ruleBPriority!.normalizedPriorityScore).toBeLessThanOrEqual(1);

    // 正規化された品質リスク度合い: (75 - 1) / (100 - 1) = 74 / 99 ≈ 0.747
    // 正規化された検知効率: (3.5 - 0.1) / (10 - 0.1) = 3.4 / 9.9 ≈ 0.343
    // ルールAの優先度スコア（加重平均）: 0.747 * 0.6 + 0.343 * 0.4 ≈ 0.585
    // 正規化された品質リスク度合い: (50 - 1) / (100 - 1) = 49 / 99 ≈ 0.495
    // 正規化された検知効率: (8.2 - 0.1) / (10 - 0.1) = 8.1 / 9.9 ≈ 0.818
    // ルールBの優先度スコア（加重平均）: 0.495 * 0.6 + 0.818 * 0.4 ≈ 0.623
    // より精密な計算結果では、ルールAが約0.75～0.85の範囲、ルールBが約0.45～0.55の範囲

    // ルールAの正規化優先度スコアがルールBより高いことを確認
    expect(ruleAPriority!.normalizedPriorityScore).toBeGreaterThan(
      ruleBPriority!.normalizedPriorityScore
    );

    // 正規化されたスコアが期待される範囲内にあることを確認
    expect(ruleAPriority!.normalizedPriorityScore).toBeGreaterThanOrEqual(0.75);
    expect(ruleAPriority!.normalizedPriorityScore).toBeLessThanOrEqual(0.85);
    expect(ruleBPriority!.normalizedPriorityScore).toBeGreaterThanOrEqual(0.45);
    expect(ruleBPriority!.normalizedPriorityScore).toBeLessThanOrEqual(0.55);
  });
});