import { visualizeRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-674
  test("推奨内容根拠の可視化機能 - 推奨根拠のタイムスタンプが欠落しているとき、エラーが発生する", () => {
    const recommendationBasisWithNullTimestamp = {
      recommendationId: "rec-001",
      basis: "過去の類似案件から判定",
      timestamp: null,
      sourceData: {
        customerId: "cust-123",
        industry: "製造業",
        pastSuccessCount: 5,
      },
    };

    expect(() =>
      visualizeRecommendationBasis(recommendationBasisWithNullTimestamp)
    ).toThrow(/RECOMMENDATION_TIMESTAMP_MISSING/);
  });
});