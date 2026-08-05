import { calculateSuccessPatternMatch } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-379
  test("成功パターンマッチング・提案アプローチ判定機能 - 顧客業種も予算も成功パターンに合致する場合、両条件を満たすアプローチが優先的に特定される", () => {
    const success_patterns = [
      {
        pattern_id: "pattern_a",
        industry: "manufacturing",
        budget_min: 5000000,
        budget_max: 10000000,
        match_condition: "single_industry",
      },
      {
        pattern_id: "pattern_b",
        industry: "retail",
        budget_min: 2000000,
        budget_max: 5000000,
        match_condition: "single_industry",
      },
      {
        pattern_id: "pattern_c",
        industry: "manufacturing",
        budget_min: 5000000,
        budget_max: 10000000,
        match_condition: "compound_industry_budget",
      },
    ];

    const customer_data = {
      industry: "manufacturing",
      budget: 7500000,
    };

    const result = calculateSuccessPatternMatch(success_patterns, customer_data);

    expect(result).toEqual({
      matched_patterns: [
        {
          pattern_id: "pattern_c",
          priority: 1,
          match_score: 100,
          condition_met: "compound",
        },
        {
          pattern_id: "pattern_a",
          priority: 2,
          match_score: 100,
          condition_met: "single",
        },
        {
          pattern_id: "pattern_b",
          priority: 3,
          match_score: 0,
          condition_met: "none",
        },
      ],
      primary_pattern: "pattern_c",
      recommendation_approach:
        "Use compound pattern C as primary strategy for manufacturing industry with 7.5M budget",
    });

    expect(result.matched_patterns[0].pattern_id).toBe("pattern_c");
    expect(result.matched_patterns[0].priority).toBe(1);
    expect(result.primary_pattern).toBe("pattern_c");
  });
});