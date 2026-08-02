import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-951
  test("[error] 提案内容検証機能 - 提案内容説明が空文字列のとき検証エラーが返される", () => {
    const proposal = {
      proposal_id: "PROP-001",
      proposal_title: "クラウド導入提案",
      proposal_description: "",
      proposal_amount: 500000,
      target_customer_id: "CUST-123",
      proposal_status: "draft",
      created_at: new Date("2024-01-15T11:00:00Z"),
    };

    const result = validateProposalContent(proposal);

    expect(result).toEqual({
      is_valid: false,
      error_code: "PROPOSAL_DESCRIPTION_EMPTY",
      error_message: "提案内容説明は必須項目です",
      status_code: 400,
    });
  });
});