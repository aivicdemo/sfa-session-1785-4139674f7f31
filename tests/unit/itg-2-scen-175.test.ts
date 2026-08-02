import { mergeCustomerRecords } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-175
  test("リコンシリエーションで、マージ対象のNULL値がマスタレコードに反映されない", () => {
    const master_record = {
      customer_id: "CUST001",
      phone_number: "090-1234-5678",
      email_address: "customer@example.com",
    };

    const merge_target_record = {
      customer_id: "CUST002",
      phone_number: null,
      email_address: null,
    };

    const merged_result = mergeCustomerRecords(master_record, merge_target_record);

    expect(merged_result.customer_id).toBe("CUST001");
    expect(merged_result.phone_number).toBe("090-1234-5678");
    expect(merged_result.email_address).toBe("customer@example.com");
  });
});