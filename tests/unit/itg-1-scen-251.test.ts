import { getApplicableApproachFromSuccessPatterns } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-251
  test("[normal] 成功パターンマトリクス参照による提案アプローチ判定機能 - 過去の成功商談パターンが1件の場合、そのパターンが適用可能であれば正しく特定される", () => {
    const success_patterns = [
      {
        industry: "製造業",
        product: "生産管理システム",
        customer_size: "従業員500～1000名",
        proposed_approach: "経営層への価値訴求",
      },
    ];

    const new_deal = {
      industry: "製造業",
      product: "生産管理システム",
      customer_size: "従業員500～1000名",
    };

    const result = getApplicableApproachFromSuccessPatterns(
      success_patterns,
      new_deal
    );

    expect(result.proposed_approach).toBe("経営層への価値訴求");
    expect(result.match_score).toBe(100);
    expect(result.is_applicable).toBe(true);
  });
});