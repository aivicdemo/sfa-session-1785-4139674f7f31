import { describe, test, expect, beforeEach } from "@jest/globals";
import { analyzeTimelineWithProposalDate } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-678: [error] 提案実行日時が null のとき時系列分析がエラーになる
  test("should return error when proposal_execution_date is null", () => {
    const sales_rep_records = [
      {
        sales_rep_id: "SR001",
        deal_id: "DEAL001",
        customer_id: "CUST001",
        proposal_execution_date: null,
        contact_frequency: 5,
        proposal_content: "商品A提案",
        follow_up_interval_days: 3,
        contract_result: true,
        contract_amount: 500000,
      },
      {
        sales_rep_id: "SR001",
        deal_id: "DEAL002",
        customer_id: "CUST002",
        proposal_execution_date: "2024-01-15T10:00:00Z",
        contact_frequency: 3,
        proposal_content: "商品B提案",
        follow_up_interval_days: 5,
        contract_result: false,
        contract_amount: 0,
      },
    ];

    expect(() => analyzeTimelineWithProposalDate(sales_rep_records)).toThrow(
      /提案実行日時/
    );
  });
});