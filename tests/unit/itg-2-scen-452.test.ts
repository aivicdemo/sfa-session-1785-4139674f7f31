import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-452
  test("顧客名と電話番号の両方が一致する場合、重複と判定される", () => {
    const existing_customer = {
      customer_id: "cust_001",
      customer_name: "田中太郎",
      phone_number: "090-1234-5678",
    };

    const new_customer = {
      customer_id: "cust_002",
      customer_name: "田中太郎",
      phone_number: "090-1234-5678",
    };

    const result = detectDuplicateCustomers(existing_customer, new_customer);

    expect(result.is_duplicate).toBe(true);
    expect(result.reason).toBe("顧客名と電話番号が完全一致");
  });
});