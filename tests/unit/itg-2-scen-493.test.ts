import { calculateDuplicateDetectionPriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-493
  test("重複検知ルール実行優先度決定機能 - 優先度スコア計算式に検知効率の重み付けが反映される", () => {
    const rules = [
      {
        rule_id: "rule_a",
        base_score: 80,
        detection_efficiency: 0.95,
      },
      {
        rule_id: "rule_b",
        base_score: 80,
        detection_efficiency: 0.70,
      },
      {
        rule_id: "rule_c",
        base_score: 60,
        detection_efficiency: 0.90,
      },
    ];

    const weight_coefficient = 0.4;

    const result = calculateDuplicateDetectionPriority(
      rules,
      weight_coefficient
    );

    expect(result).toEqual([
      {
        rule_id: "rule_a",
        priority_score: 118.0,
        priority_order: 1,
      },
      {
        rule_id: "rule_b",
        priority_score: 108.0,
        priority_order: 2,
      },
      {
        rule_id: "rule_c",
        priority_score: 96.0,
        priority_order: 3,
      },
    ]);
  });
});