import { saveRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨支援システム - 推奨根拠の可視化機能", () => {
  // SCEN-114
  test("推奨根拠テーブルへの保存時に根拠説明が空のとき保存が拒否される", () => {
    const recommendationId = "rec-001";
    const emptyReasoning = "";

    expect(() =>
      saveRecommendationReasoning({
        recommendationId,
        reasoning: emptyReasoning,
      })
    ).toThrow(/根拠説明/);
  });
});