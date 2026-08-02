import { judgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-251
  test("類似度が判定閾値直上のとき、統合判定が閾値以上として判定される", () => {
    const similarityScore = 0.851;
    const threshold = 0.85;

    const result = judgeIntegration({
      similarityScore,
      threshold,
    });

    expect(result).toBe(true);
  });
});