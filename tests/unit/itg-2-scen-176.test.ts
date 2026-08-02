import { reconcileCustomerRecords } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-176
  test("マスタレコードのNULL値がマージ対象の値で埋められる", () => {
    const master_record = {
      customer_id: "CUST-001",
      customer_name: "テスト顧客A",
      phone_number: null,
      email: "a@example.com",
      address: "東京都渋谷区",
    };

    const merge_target_record = {
      customer_id: "CUST-002",
      customer_name: "テスト顧客A",
      phone_number: "09012345678",
      email: "a@example.com",
      address: "東京都渋谷区",
    };

    const result = reconcileCustomerRecords(master_record, merge_target_record);

    expect(result.customer_id).toBe("CUST-001");
    expect(result.phone_number).toBe("09012345678");
    expect(result.customer_name).toBe("テスト顧客A");
    expect(result.email).toBe("a@example.com");
    expect(result.address).toBe("東京都渋谷区");
  });
});