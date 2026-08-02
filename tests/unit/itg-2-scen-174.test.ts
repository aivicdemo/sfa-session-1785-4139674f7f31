import {
  mergeAndReconcileDuplicateCustomers,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-174: [normal] 顧客データ重複検出・統合判定機能 - リコンシリエーション（マスタレコード既存値 vs マージデータ）で、マスタレコード値が優先される", () => {
    const master_customer_record = {
      customer_id: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone_number: "090-1234-5678",
    };

    const merge_target_record = {
      customer_id: "CUST-999",
      name: "山田太郎",
      email: "yamada.taro@example.com",
      phone_number: "090-9999-9999",
    };

    const result = mergeAndReconcileDuplicateCustomers(
      master_customer_record,
      merge_target_record
    );

    expect(result).toEqual({
      customer_id: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone_number: "090-1234-5678",
    });
  });
});