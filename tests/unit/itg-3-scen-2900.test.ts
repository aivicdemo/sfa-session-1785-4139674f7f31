import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2900
  test("推奨内容の適合性評価スコア計算 - 複数の判定要因を集計した際に小数第3位が発生するときに正しく丸められる", async () => {
    const mock_aiRecommendationEngine = {
      evaluatePatternRelevance: jest.fn()
        .mockResolvedValueOnce(0.3333)
        .mockResolvedValueOnce(0.4444)
        .mockResolvedValueOnce(0.2222),
    };

    const factor_1_score = 0.3333;
    const factor_2_score = 0.4444;
    const factor_3_score = 0.2222;

    const relevance_factors = [
      { factor_id: "customer_attribute_match", score: factor_1_score },
      { factor_id: "deal_condition_match", score: factor_2_score },
      { factor_id: "success_pattern_match", score: factor_3_score },
    ];

    const evaluation_input = {
      pattern_id: "pattern_001",
      customer_data: {
        industry: "manufacturing",
        company_size: "mid_range",
      },
      deal_condition: {
        product_category: "automation_solution",
        deal_amount: 5000000,
      },
      success_pattern: {
        pattern_name: "mid_size_manufacturing_automation",
        historical_success_rate: 0.75,
      },
      relevance_factors: relevance_factors,
      ai_engine: mock_aiRecommendationEngine,
    };

    const result = await evaluatePatternRelevance(evaluation_input);

    expect(result).toBeDefined();
    expect(typeof result.composite_score).toBe("number");
    expect(result.composite_score).toBeGreaterThanOrEqual(0);
    expect(result.composite_score).toBeLessThanOrEqual(100);

    const decimal_places = (result.composite_score.toString().split(".")[1] || "").length;
    expect(decimal_places).toBeLessThanOrEqual(2);

    const expected_sum = factor_1_score + factor_2_score + factor_3_score;
    const expected_composite = Math.round(expected_sum * 100) / 100;
    expect(result.composite_score).toBe(expected_composite);

    expect(result.evaluation_timestamp).toBeDefined();
    expect(typeof result.evaluation_timestamp).toBe("string");
  });
});