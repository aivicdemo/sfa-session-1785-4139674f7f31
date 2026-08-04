import { evaluateProposalConstraintMatching } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案内容と顧客制約条件の自動照合機能", () => {
  // SCEN-1398
  test("複数件の提案内容がすべて照合対象に含まれ、各提案の照合結果が返却される", () => {
    const proposal_a = {
      proposal_id: "PROP001",
      product_name: "クラウドシステム A",
      budget_required: 8000000,
      implementation_period_days: 60,
      required_industry: "製造業",
    };

    const proposal_b = {
      proposal_id: "PROP002",
      product_name: "データ分析ツール B",
      budget_required: 5000000,
      implementation_period_days: 45,
      required_industry: "金融業",
    };

    const proposal_c = {
      proposal_id: "PROP003",
      product_name: "業務自動化プラットフォーム C",
      budget_required: 12000000,
      implementation_period_days: 90,
      required_industry: "小売業",
    };

    const proposals = [proposal_a, proposal_b, proposal_c];

    const customer_constraints = {
      customer_id: "CUST001",
      budget_limit: 10000000,
      max_implementation_days: 90,
      allowed_industries: ["製造業", "小売業"],
    };

    const result = evaluateProposalConstraintMatching(
      proposals,
      customer_constraints
    );

    expect(result.evaluated_proposals).toHaveLength(3);

    const evaluated_ids = result.evaluated_proposals.map(
      (p: { proposal_id: string }) => p.proposal_id
    );
    expect(evaluated_ids).toContain("PROP001");
    expect(evaluated_ids).toContain("PROP002");
    expect(evaluated_ids).toContain("PROP003");

    const prop_a_result = result.evaluated_proposals.find(
      (p: { proposal_id: string }) => p.proposal_id === "PROP001"
    );
    expect(prop_a_result).toBeDefined();
    expect(prop_a_result.budget_compliant).toBe(true);
    expect(prop_a_result.timeline_compliant).toBe(true);
    expect(prop_a_result.industry_compliant).toBe(true);
    expect(prop_a_result.matching_score).toBe(100);

    const prop_b_result = result.evaluated_proposals.find(
      (p: { proposal_id: string }) => p.proposal_id === "PROP002"
    );
    expect(prop_b_result).toBeDefined();
    expect(prop_b_result.budget_compliant).toBe(true);
    expect(prop_b_result.timeline_compliant).toBe(true);
    expect(prop_b_result.industry_compliant).toBe(false);
    expect(prop_b_result.matching_score).toBe(67);

    const prop_c_result = result.evaluated_proposals.find(
      (p: { proposal_id: string }) => p.proposal_id === "PROP003"
    );
    expect(prop_c_result).toBeDefined();
    expect(prop_c_result.budget_compliant).toBe(false);
    expect(prop_c_result.timeline_compliant).toBe(true);
    expect(prop_c_result.industry_compliant).toBe(true);
    expect(prop_c_result.matching_score).toBe(67);

    expect(result.total_evaluated_count).toBe(3);
    expect(result.fully_compliant_count).toBe(1);
    expect(result.partially_compliant_count).toBe(2);
  });
});