import { evaluateSuccessPatternMatchingDegree } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-285
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの業界特性が現在の顧客の業界と全く異なる場合、低マッチング度で判定される", () => {
    const success_pattern = {
      pattern_id: "SP001",
      industry: "金融",
      proposal_method: "定期訪問型",
      success_rate: 0.85,
    };

    const customer_info = {
      customer_id: "CUST-999",
      industry: "製造業",
      company_size: "中堅企業",
    };

    const result = evaluateSuccessPatternMatchingDegree(
      success_pattern,
      customer_info
    );

    expect(result.matching_degree).toBe(0.15);
    expect(result.matching_degree_percentage).toBe("15%");
    expect(result.recommendation_level).toBe("低");
    expect(result.reason).toContain("対象業界（金融）");
    expect(result.reason).toContain("顧客業界（製造業）");
    expect(result.reason).toContain("大きな乖離");
    expect(result.reason).toContain("参考価値は限定的");
  });
});