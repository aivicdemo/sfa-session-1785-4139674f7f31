import { mergeCustomersByNormalization } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-633
  test("大文字と小文字が同一に正規化される", () => {
    const input_customer_1 = {
      customer_id: "CUST001",
      customer_name: "Tanaka Taro",
      email: "tanaka.taro@example.com",
      phone: "090-1234-5678",
      address: "Tokyo",
      created_at: new Date("2024-01-15T10:00:00Z"),
      updated_at: new Date("2024-01-15T10:00:00Z"),
    };

    const input_customer_2 = {
      customer_id: "CUST002",
      customer_name: "tanaka taro",
      email: "tanaka.taro+alt@example.com",
      phone: "090-1234-5678",
      address: "Tokyo",
      created_at: new Date("2024-01-15T11:00:00Z"),
      updated_at: new Date("2024-01-15T11:00:00Z"),
    };

    const result = mergeCustomersByNormalization([
      input_customer_1,
      input_customer_2,
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].customer_name).toBe("tanaka taro");
    expect(result[0].merged_customer_ids).toContain("CUST001");
    expect(result[0].merged_customer_ids).toContain("CUST002");
    expect(result[0].normalization_applied).toBe(true);
  });
});