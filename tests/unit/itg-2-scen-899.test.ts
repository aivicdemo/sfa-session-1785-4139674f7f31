import { validateCustomerPurchaseConsiderationData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-899
  test("提案内容から提案商品フィールドが欠落しているとき不整合エラーを検出する", () => {
    const invalidProposalData = {
      customerId: "CUST-001",
      proposalDate: "2024-01-15",
      proposalAmount: 500000,
      proposedProductId: undefined,
    };

    expect(() =>
      validateCustomerPurchaseConsiderationData(invalidProposalData)
    ).toThrow(/提案商品/);
  });
});