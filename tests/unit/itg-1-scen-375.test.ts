import { calculateSuccessPatternMatchScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-375
  test("成功パターンマッチング・提案アプローチ判定機能 - 過去の成功商談パターンが1件のとき、そのパターンが現在の顧客条件に適用可能と判定される", () => {
    const past_success_pattern = {
      pattern_id: "PAT-001",
      industry: "製造業",
      company_size: "従業員1000名以上",
      product_category: "生産管理システム",
      contract_amount_min: 5000000,
    };

    const current_customer_condition = {
      industry: "製造業",
      company_size: "従業員2000名",
      product_category: "生産管理システム",
      estimated_amount: 6000000,
    };

    const result = calculateSuccessPatternMatchScore(
      past_success_pattern,
      current_customer_condition
    );

    expect(result.applicable).toBe(true);
    expect(result.matched_pattern_id).toBe("PAT-001");
    expect(result.matched_attributes_count).toBe(4);
    expect(result.matched_attributes).toEqual([
      "industry",
      "company_size",
      "product_category",
      "amount_range",
    ]);
    expect(result.reason).toBe(
      "全ての条件が現在の顧客条件と合致"
    );
  });
});