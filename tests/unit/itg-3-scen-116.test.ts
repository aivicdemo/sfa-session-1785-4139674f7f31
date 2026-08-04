import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 成功パターン関連度スコア検証", () => {
  // SCEN-116
  test("関連度スコアが1.0を超える値の場合にエラーを発生させる", () => {
    const invalid_pattern_relevance_score = 1.5;
    const new_deal_conditions = {
      customer_industry: "IT",
      customer_scale: "large",
      deal_stage: "proposal",
      deal_value: 5000000,
    };

    expect(() =>
      evaluatePatternRelevance(new_deal_conditions, invalid_pattern_relevance_score)
    ).toThrow(/有効範囲外/);
  });
});