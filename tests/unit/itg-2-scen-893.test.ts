import { describe, test, expect } from "@jest/globals";
import { validateCustomerPurchaseData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-893: 購買履歴から顧客IDフィールドが欠落しているとき不整合エラーを検出する", () => {
    const purchase_history_without_customer_id = {
      purchase_id: "PUR-20240115-001",
      purchase_date: "2024-01-15",
      product_name: "Enterprise License",
      amount: 500000,
      currency: "JPY",
      status: "completed",
    };

    expect(() => {
      validateCustomerPurchaseData(purchase_history_without_customer_id);
    }).toThrow(/MISSING_CUSTOMER_ID/);

    expect(() => {
      validateCustomerPurchaseData(purchase_history_without_customer_id);
    }).toThrow(/顧客IDフィールドが必須です/);
  });
});