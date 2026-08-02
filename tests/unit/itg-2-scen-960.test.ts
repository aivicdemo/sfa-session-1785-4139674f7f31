import { integrateCustomerPurchaseData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-960
  test("購買結果記録・営業データ統合機能 - 顧客ID が入力されていない場合に処理が中断される", () => {
    const inputDataEmptyCustomerId = {
      customerId: "",
      productId: "PROD-001",
      purchaseAmount: 150000,
      purchaseDateTime: "2024-01-15T10:30:00Z",
    };

    expect(() =>
      integrateCustomerPurchaseData(inputDataEmptyCustomerId)
    ).toThrow(/CUSTOMER_ID_REQUIRED/);
  });
});