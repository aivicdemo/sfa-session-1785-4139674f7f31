import { validateProposalData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-900
  test("提案内容から提案作成日フィールドが欠落しているとき不整合エラーを検出する", () => {
    const proposalData = {
      proposal_id: "PROP001",
      customer_id: "CUST001",
      proposal_title: "システム導入提案",
      proposal_amount: 500000,
      proposal_date: null,
    };

    const result = validateProposalData(proposalData);

    expect(result).toEqual({
      error_code: "MISSING_PROPOSAL_DATE",
      error_message: "提案作成日が指定されていません",
      error_type: "INCONSISTENCY_ERROR",
    });
  });
});