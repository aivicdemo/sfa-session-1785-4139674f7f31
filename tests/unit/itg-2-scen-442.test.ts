import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-442
  test("重複候補顧客が複数件の場合、全ての顧客について重複判定が実行される", () => {
    const testData = [
      {
        customer_id: "CUST001",
        customer_name: "顧客A",
        email: "customerA@example.com",
        phone: "090-1234-5678",
        company_name: "株式会社A",
      },
      {
        customer_id: "CUST002",
        customer_name: "顧客A",
        email: "customerA@example.com",
        phone: "090-1234-5679",
        company_name: "株式会社A",
      },
      {
        customer_id: "CUST003",
        customer_name: "顧客A",
        email: "customerA@example.com",
        phone: "090-1234-5680",
        company_name: "株式会社A",
      },
    ];

    const result = detectDuplicateCustomers(testData);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          customer_id: "CUST001",
          duplicate_candidates: expect.arrayContaining(["CUST002", "CUST003"]),
        }),
        expect.objectContaining({
          customer_id: "CUST002",
          duplicate_candidates: expect.arrayContaining(["CUST001", "CUST003"]),
        }),
        expect.objectContaining({
          customer_id: "CUST003",
          duplicate_candidates: expect.arrayContaining(["CUST001", "CUST002"]),
        }),
      ])
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("customer_id");
    expect(result[0]).toHaveProperty("duplicate_candidates");
    expect(Array.isArray(result[0].duplicate_candidates)).toBe(true);
  });
});