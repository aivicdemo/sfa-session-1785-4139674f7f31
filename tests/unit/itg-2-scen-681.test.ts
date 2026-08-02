import { getVisibleRecommendationBases } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-681: 推奨根拠が30日を超える場合は可視化対象から除外される", () => {
    const today = new Date("2024-01-15T00:00:00Z");
    const thirtyOneDaysAgo = new Date("2023-12-15T00:00:00Z");

    const bases = [
      {
        id: "base_001",
        recommendationId: "rec_001",
        createdAt: thirtyOneDaysAgo,
        content: "過去事例に基づく根拠",
        type: "historical_case",
      },
    ];

    const visibleBases = getVisibleRecommendationBases(bases, today);

    expect(visibleBases).toEqual([]);
  });
});