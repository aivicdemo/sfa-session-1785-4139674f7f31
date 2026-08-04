import { evaluateDataQualityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質スコア算出機能", () => {
  // SCEN-419
  test("スコアが閾値直上の場合、正しい改善優先度ランクが付与される", () => {
    const input_data_quality_score = 70.0;
    const input_threshold = 70;

    const result = evaluateDataQualityScore(
      input_data_quality_score,
      input_threshold
    );

    expect(result.score).toBe(70.0);
    expect(result.improvement_priority_rank).toBe("Priority2");
  });
});