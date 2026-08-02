import {
  detectDuplicateCustomers,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と統合判定機能", () => {
  // SCEN-458
  test("電話番号が空文字列の場合、該当属性を検証対象から除外する", () => {
    const customer_with_empty_phone = {
      customer_id: "CUST-001",
      customer_name: "田中太郎",
      email: "tanaka@example.com",
      phone_number: "",
      address: "東京都渋谷区",
      created_at: "2024-01-15T10:00:00Z",
    };

    const existing_customers = [
      {
        customer_id: "CUST-002",
        customer_name: "田中太郎",
        email: "tanaka@example.com",
        phone_number: "09012345678",
        address: "東京都渋谷区",
        created_at: "2024-01-10T10:00:00Z",
      },
    ];

    const result = detectDuplicateCustomers(
      customer_with_empty_phone,
      existing_customers
    );

    expect(result).toEqual(
      expect.objectContaining({
        is_duplicate: true,
        duplicate_customer_id: "CUST-002",
        match_score: expect.any(Number),
        excluded_attributes: expect.arrayContaining(["phone_number"]),
        scoring_breakdown: expect.not.objectContaining({
          phone_number: expect.anything(),
        }),
      })
    );

    expect(result.match_score).toBeGreaterThan(0);
    expect(result.match_score).toBeLessThanOrEqual(100);
  });
});