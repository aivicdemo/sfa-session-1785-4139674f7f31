import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-566
  test("適用可能スコアが閾値0.5超のとき成功パターンが適用可能と判定される", () => {
    const new_deal_data = {
      customer_industry: "IT",
      deal_amount: 5000000,
      purchase_stage: "evaluation",
      customer_size: "medium",
    };

    const past_success_pattern = {
      pattern_id: "pattern_001",
      industry: "IT",
      amount_range_min: 4000000,
      amount_range_max: 6000000,
      stage: "evaluation",
      company_size: "medium",
    };

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.51),
    };

    const result = evaluatePatternRelevance(
      new_deal_data,
      past_success_pattern,
      mock_ai_engine
    );

    expect(result.is_applicable).toBe(true);
    expect(result.relevance_score).toBe(0.51);
    expect(result.pattern_id).toBe("pattern_001");
  });
});