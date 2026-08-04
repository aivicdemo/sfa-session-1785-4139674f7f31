import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推論精度スコア算出機能 - パターンマッチ度100の場合", () => {
  test("SCEN-2375: パターンマッチ度100では完全適合として正確に反映される", () => {
    const customer_industry = "製造業";
    const deal_stage = "提案";
    const budget_scale = "5000万円以上";
    const decision_maker_count = 3;

    const mock_ai_engine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        match_score: 100,
        is_fully_matched: true,
        pattern_category: "standard_proposal",
        confidence_level: "HIGH",
        match_percentage: "100%",
      }),
    };

    const result = evaluatePatternRelevance(
      {
        customer_industry,
        deal_stage,
        budget_scale,
        decision_maker_count,
      },
      mock_ai_engine
    );

    expect(result.match_score).toBe(100);
    expect(result.is_fully_matched).toBe(true);
    expect(result.pattern_category).toBe("standard_proposal");
    expect(result.confidence_level).toBe("HIGH");
    expect(result.match_percentage).toBe("100%");
  });
});