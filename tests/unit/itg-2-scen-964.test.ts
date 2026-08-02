import { describe, test, expect } from "@jest/globals";
import { recordPurchaseDecision } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-964
  test("購買金額が入力されていない場合に処理が中断される", () => {
    const input = {
      customer_name: "株式会社テスト",
      product_name: "営業支援システム",
      purchase_date: "2024-01-15T10:00:00Z",
      purchase_amount: "",
      quantity: 5,
      sales_person_id: "SP001",
    };

    expect(() => recordPurchaseDecision(input)).toThrow(/購買金額/);
  });
});