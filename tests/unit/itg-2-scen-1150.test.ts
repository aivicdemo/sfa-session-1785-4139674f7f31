import { validateCustomerDataBatch } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1150
  test("顧客データ複数件の入力リストに対して検証を実行した場合、全件数と同じ数の検証結果が返される", () => {
    const input_customer_records = [
      {
        customer_id: "CUST001",
        customer_name: "株式会社A",
        email: "contact@a.com",
        phone: "03-1111-1111",
      },
      {
        customer_id: "CUST002",
        customer_name: "株式会社B",
        email: "contact@b.com",
        phone: "03-2222-2222",
      },
      {
        customer_id: "CUST003",
        customer_name: "株式会社C",
        email: "contact@c.com",
        phone: "03-3333-3333",
      },
      {
        customer_id: "CUST004",
        customer_name: "株式会社D",
        email: "contact@d.com",
        phone: "03-4444-4444",
      },
      {
        customer_id: "CUST005",
        customer_name: "株式会社E",
        email: "contact@e.com",
        phone: "03-5555-5555",
      },
    ];

    const result = validateCustomerDataBatch(input_customer_records);

    expect(result).toHaveLength(5);
    expect(
      result.every(
        (item) =>
          "customer_id" in item &&
          "validation_status" in item &&
          "errors" in item
      )
    ).toBe(true);
    expect(result[0].customer_id).toBe("CUST001");
    expect(typeof result[0].validation_status).toBe("string");
    expect(Array.isArray(result[0].errors)).toBe(true);
    expect(result[4].customer_id).toBe("CUST005");
  });
});