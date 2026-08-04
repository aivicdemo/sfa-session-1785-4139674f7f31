import { evaluateRecommendationScore } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度スコア算出機能", () => {
  test("SCEN-2446: 商談の成功確率が50%のときスコア計算に中間値として反映される", () => {
    // 成功確率50%の商談条件を用意
    const input = {
      successProbability: 0.5,
      dealValue: 1000000,
      customerSegment: "enterprise",
    };

    // 推奨精度スコア算出関数を呼び出す
    const score = evaluateRecommendationScore(input);

    // スコア値が最小値と最大値の中間範囲（45～55）に収まっていることを検証
    expect(score).toBeGreaterThanOrEqual(45);
    expect(score).toBeLessThanOrEqual(55);

    // スコア値が成功確率50%に対応する中間値として正確に計算されていることを確認
    // 期待値：スコア = 50.0 ± 許容誤差2.5以内
    expect(Math.abs(score - 50.0)).toBeLessThanOrEqual(2.5);
  });
});