import { evaluateProposalApproach } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-259
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの購買金額下限が現在の顧客予算より高い場合、適用不可と判定される", () => {
    const success_pattern_matrix = {
      min_purchase_amount: 5000000,
      proposal_approach: "初期接触営業",
    };

    const customer_budget = 4000000;

    const result = evaluateProposalApproach({
      success_pattern: success_pattern_matrix,
      current_budget: customer_budget,
    });

    expect(result.applicable).toBe(false);
    expect(result.status).toBe("適用不可");
  });
});