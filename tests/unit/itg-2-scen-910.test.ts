import { validateCustomerPurchaseConsiderationData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-910
  test("購買履歴の顧客IDと提案内容の顧客IDが不一致のとき不整合を検出する", () => {
    const purchase_history = {
      customer_id: "C001",
      purchase_date: "2024-01-15",
      amount: 50000,
    };

    const proposal_content = {
      customer_id: "C002",
      product_name: "Enterprise Plan",
      proposal_amount: 100000,
    };

    const result = validateCustomerPurchaseConsiderationData(
      purchase_history,
      proposal_content
    );

    expect(result.status).toBe(false);
    expect(result.error_code).toBe("MISMATCH_CUSTOMER_ID");
    expect(result.error_message).toBe(
      "購買履歴の顧客ID(C001)と提案内容の顧客ID(C002)が不一致です"
    );
  });
});