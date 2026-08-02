import { validateCustomerPurchaseConsiderationData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-904
  test("購買履歴の購買金額が負数のとき不整合を検出する", () => {
    const purchase_history = {
      purchase_amount: -1000,
      customer_id: "C001",
      purchase_date: "2024-01-15",
    };

    const validation_result = validateCustomerPurchaseConsiderationData(
      purchase_history
    );

    expect(validation_result.is_valid).toBe(false);
    expect(validation_result.error_list).toContainEqual(
      expect.objectContaining({
        message: expect.stringMatching(/購買金額は負数を許可しません/),
      })
    );
  });
});