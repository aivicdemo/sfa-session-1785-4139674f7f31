import { validateProposalInput } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-906
  test("提案内容の提案金額が0のとき不整合を検出する", () => {
    const proposalInput = {
      proposalId: "PROP-001",
      proposalName: "システム導入提案",
      proposalAmount: 0,
    };

    const result = validateProposalInput(proposalInput);

    expect(result.errorCode).toBe("VALIDATION_ERROR_ZERO_AMOUNT");
    expect(result.errorMessage).toBe("提案金額は0より大きい値を入力してください");
    expect(result.validationStatus).toBe("NG");
  });
});