import { validateCustomerPurchaseConsiderationData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-907
  test("提案内容の提案金額が負数のとき不整合を検出する", () => {
    const customerPurchaseData = {
      customerId: "CUST001",
      proposalAmount: -50000,
      proposalDate: "2024-01-15",
      proposalContent: "標準プラン",
    };

    const validationResult = validateCustomerPurchaseConsiderationData(
      customerPurchaseData
    );

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toHaveLength(1);
    expect(validationResult.errors[0].errorCode).toBe(
      "PROPOSAL_AMOUNT_NEGATIVE"
    );
    expect(validationResult.errors[0].message).toBe(
      "提案金額は負数であってはいけません"
    );
  });
});