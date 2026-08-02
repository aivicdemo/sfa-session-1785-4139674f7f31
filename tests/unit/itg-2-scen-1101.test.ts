import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-1101: 顧客名が空文字列のとき、重複判定が適切に実行される", () => {
    const customerA = {
      customer_id: "CUST_001",
      customer_name: "",
      address: "東京都渋谷区",
      phone: "03-1234-5678",
      email: "contact@example.com",
    };

    const customerB = {
      customer_id: "CUST_002",
      customer_name: "田中太郎",
      address: "東京都新宿区",
      phone: "03-9876-5432",
      email: "tanaka@example.com",
    };

    const result = detectDuplicateCustomers([customerA, customerB]);

    expect(result).toEqual({
      duplicate_status: "JUDGMENT_SKIPPED",
      error_code: "CUST_NAME_EMPTY",
      records_merged: false,
      skipped_record_id: "CUST_001",
      skipped_reason: "顧客名が空文字列のため判定対象外",
      duplicate_pairs: [],
    });
  });
});