import { calculateImprovementPriorityScore } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-673
  test("改善優先度スコア算出機能 - 影響度の値が負数のとき処理がエラーになる", () => {
    const input = {
      impact: -5,
      urgency: 8,
      feasibility: 7,
      frequency: 3,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/影響度/);
  });
});