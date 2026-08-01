import { calculateImprovementPriorityScore } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-679
  test("改善優先度スコア算出機能 - 問題パターンの影響度が最大値ちょうどのとき優先度スコアが最高値で計算される", () => {
    const impact_degree = 100;
    const frequency_score = 50;
    const resolution_difficulty = 50;

    const result = calculateImprovementPriorityScore({
      impact_degree,
      frequency_score,
      resolution_difficulty,
    });

    expect(result).toBe(100);
  });
});