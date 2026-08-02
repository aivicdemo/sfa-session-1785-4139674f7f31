import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-934
  test("[error] 提案内容検証機能 - 顧客IDが未入力のとき検証エラーが返される", () => {
    const proposal_data = {
      customer_id: "",
      proposal_name: "テスト提案",
      proposal_amount: 100000,
      proposal_date: "2024-01-15",
      proposal_description: "説明",
    };

    const result = validateProposalContent(proposal_data);

    expect(result).toEqual({
      is_valid: false,
      error_code: "VALIDATION_ERROR_CUSTOMER_ID_REQUIRED",
      error_message: "顧客IDは必須項目です",
      error_field: "customerId",
    });
  });
});