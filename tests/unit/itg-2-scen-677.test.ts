import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-677
  test("推奨根拠スコアが数値型でないとき、エラーが発生する", () => {
    const invalidRecommendationData = {
      recommendationId: "rec-001",
      rationale_score: "abc",
      rationale_basis: "過去事例に基づく",
      success_pattern_id: "pattern-123",
    };

    expect(() =>
      visualizeRecommendationRationale(invalidRecommendationData)
    ).toThrow(/推奨根拠スコアは数値型である必要があります/);
  });
});