import { validateCustomerDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1149
  test("顧客データ1件の入力リストに対して検証を実行した場合、1件の検証結果が返される", () => {
    const input_customer_data = [
      {
        customer_id: "CUST001",
        customer_name: "株式会社テスト",
        email: "test@example.com",
        phone: "09012345678",
        address: "東京都渋谷区",
      },
    ];

    const result = validateCustomerDataQuality(input_customer_data);

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("validation_status");
    expect(result[0]).toHaveProperty("validation_items");
    expect(result[0]).toHaveProperty("validation_timestamp");
    expect(["合格", "不合格"]).toContain(result[0].validation_status);
    expect(Array.isArray(result[0].validation_items)).toBe(true);
    expect(result[0].validation_items.length).toBeGreaterThan(0);
    expect(typeof result[0].validation_timestamp).toBe("string");
  });
});