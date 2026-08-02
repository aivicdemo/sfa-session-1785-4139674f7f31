import { validatePurchaseHistoryInput } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客購買検討データ入力検証機能", () => {
  // SCEN-896
  test("商品カテゴリフィールドが欠落しているとき不整合エラーを検出する", () => {
    const purchase_history_record = {
      customer_id: "CUST-20240115-001",
      purchase_datetime: "2024-01-15T11:00:00Z",
      product_name: "ERP導入支援サービス",
      amount: 5000000,
      product_category: null,
    };

    const result = validatePurchaseHistoryInput(purchase_history_record);

    expect(result.error_code).toBe("MISSING_PRODUCT_CATEGORY");
    expect(result.error_level).toBe("ERROR");
    expect(result.error_message).toBe(
      "商品カテゴリフィールドが必須項目として欠落しています"
    );
  });
});