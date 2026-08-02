import { calculateDuplicateDetectionPriorityScore } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-482: [edge] 重複検知ルール実行優先度決定機能 - 検知効率が最大値のときに優先度スコアが最大になる
  test("検知効率が最大値（1.0）のときに優先度スコアが最大値（1000）と一致すること", () => {
    const input = {
      detection_efficiency: 1.0,
      detection_accuracy: 0.85,
      processing_time_seconds: 120,
      rule_complexity: 0.5,
    };

    const result = calculateDuplicateDetectionPriorityScore(input);

    expect(result).toBe(1000);
  });
});