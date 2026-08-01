import { describe, test, expect } from "@jest/globals";
import { evaluateProposalApproachBySuccessPattern } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-264
  test("成功パターンマトリクス参照による提案アプローチ判定機能 - 購買予想金額が0の場合、金額条件による除外判定が実行されない", () => {
    const customer_input = {
      customer_id: "CUST-001",
      predicted_purchase_amount: 0,
      customer_rank: "A",
      industry: "製造業",
      region: "関東",
    };

    const success_pattern_matrix = [
      {
        pattern_id: "PAT-001",
        customer_rank: "A",
        industry: "製造業",
        region: "関東",
        min_amount: 100000,
        max_amount: 500000,
        recommended_approach: "Executive_Briefing",
        success_rate: 0.75,
      },
      {
        pattern_id: "PAT-002",
        customer_rank: "A",
        industry: "製造業",
        region: "関東",
        min_amount: 0,
        max_amount: 99999,
        recommended_approach: "Technical_Workshop",
        success_rate: 0.65,
      },
    ];

    const result = evaluateProposalApproachBySuccessPattern(
      customer_input,
      success_pattern_matrix
    );

    expect(result.proposal_approach).toBe("Technical_Workshop");
    expect(result.matched_pattern_id).toBe("PAT-002");
    expect(result.amount_exclusion_applied).toBe(false);
    expect(result.conditions_matched).toEqual({
      customer_rank_matched: true,
      industry_matched: true,
      region_matched: true,
      amount_range_matched: true,
    });
    expect(result.success_rate).toBe(0.65);
  });
});