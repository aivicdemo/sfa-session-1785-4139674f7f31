import {
  analyzeProposalAndCustomerInteractionPattern,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-442
  test("提案内容と顧客対応記録が両方入力された場合、標準プロセスとの比較が実行される", () => {
    const proposal_input = {
      proposal_id: "PROP-20240115-001",
      proposal_date: new Date("2024-01-15T10:00:00Z"),
      proposal_product: "エンタープライズプラン",
      proposal_amount: 500000,
      proposal_reason: "顧客の既存システム老朽化に対応",
      customer_id: "CUST-A001",
      salesperson_id: "SALES-001",
    };

    const customer_interaction_input = {
      interaction_id: "INT-20240115-001",
      interaction_date: new Date("2024-01-15T14:30:00Z"),
      interaction_content: "提案内容について顧客と初期ヒアリング実施",
      interaction_type: "phone_call",
      salesperson_id: "SALES-001",
      customer_id: "CUST-A001",
      customer_reaction: "positive_interest",
    };

    const standard_process_stub = {
      stage_name: "initial_proposal",
      recommended_pattern: "schedule_followup_within_3days",
      average_contract_days: 14,
    };

    const result = analyzeProposalAndCustomerInteractionPattern(
      proposal_input,
      customer_interaction_input,
      standard_process_stub
    );

    expect(result.analysis_count).toBe(2);
    expect(result.stage_alignment).toEqual({
      matched: true,
      expected_stage: "initial_proposal",
      actual_stage: "initial_proposal",
    });
    expect(result.compliance_score).toBe(85);
    expect(result.appropriateness_judgment).toBe("基準内");
  });
});