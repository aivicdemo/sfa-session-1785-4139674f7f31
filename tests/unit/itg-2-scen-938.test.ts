import { validateProposalContent } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-938
  test("提案内容検証機能 - 提案金額が負数のとき検証エラーが返される", () => {
    const testData = {
      proposalId: "PROP-001",
      customerId: "CUST-001",
      proposalAmount: -50000,
      proposalDate: "2024-01-15",
      productCategory: "Software",
    };

    const result = validateProposalContent(testData);

    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe("INVALID_PROPOSAL_AMOUNT");
    expect(result.errorMessage).toMatch(/提案金額は0以上の数値を入力してください/);
  });
});