import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-933
  test("提案内容検証機能 - 提案内容説明が未入力のとき検証エラーが返される", () => {
    const input = {
      proposal_name: "システム導入提案",
      customer_name: "ABC株式会社",
      proposal_amount: 5000000,
      proposal_description: "",
      proposal_date: "2024-01-15",
    };

    const result = validateProposalContent(input);

    expect(result).toEqual({
      is_valid: false,
      error_code: "PROPOSAL_DESCRIPTION_REQUIRED",
      error_message: "提案内容説明は必須項目です",
    });
  });
});