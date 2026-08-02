import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-936
  test("提案日付が未入力のとき検証エラーが返される", () => {
    const proposal = {
      proposal_id: "PROP-001",
      proposal_title: "システム導入提案",
      customer_name: "株式会社ABC",
      amount: 5000000,
      proposal_date: null,
      status: "draft"
    };

    const result = validateProposalContent(proposal);

    expect(result).toEqual({
      is_valid: false,
      error_code: "PROPOSAL_DATE_REQUIRED",
      error_message: "提案日付は必須項目です"
    });
  });
});