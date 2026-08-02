import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-481
  test("重複検知ルール実行優先度決定機能 - 品質リスク度合いが最大値のときに優先度スコアが最大になる", () => {
    const input = {
      qualityRiskDegree: 100,
      ruleComplexity: 50,
      targetDataCount: 5000,
    };

    const result = decideDuplicateDetectionRulePriority(input);

    expect(result.priorityScore).toBe(1000);
  });
});